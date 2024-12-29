import { NextFunction, Request, Response } from "express";
import { config } from "../config";
import axios from "axios";
import { createJwtToken, handleError } from "../util";
import UserModel from "../model/user";
import RoutineConfigModel from "../model/routine-config";
import RoutineRecordModel from "../model/routine-record";
import WorkoutLibraryModel from "../model/workout-library";
import s3 from "../s3";
import { ManagedUpload } from "aws-sdk/clients/s3";
import sharp from "sharp";
import { CustomError, ErrorDefinitions } from "../types/error";
import { isValidObjectId } from "mongoose";

export const checkAccessToken = async (req: Request, res: Response) => {
    try {
        res.status(200).json({ message: "토큰이 유효합니다." });
    } catch (e) {
        handleError(res, e);
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { clientId, redirectUrl } = config.oauth.google;
        let url = "https://accounts.google.com/o/oauth2/v2/auth";
        url += `?client_id=${clientId}`;
        url += `&redirect_uri=${redirectUrl}`;
        url += "&response_type=code";
        url += "&scope=email profile";
        console.log("loginUser");
        res.redirect(url);
    } catch (e) {
        handleError(res, e);
    }
};

export const loginRedirectUser = async (req: Request, res: Response) => {
    const { clientId, clientSecret, redirectUrl, tokenUrl, userInfoUrl } =
        config.oauth.google;
    const { code, error } = req.query;

    if (error === "access_denied") {
        // 사용자가 로그인을 취소한 경우
        return res.redirect(`${config.clientUrl}/login?error=access_denied`);
    }

    if (!code) {
        // code가 없는 경우, 잘못된 요청 처리
        return res.redirect(`${config.clientUrl}/login?error=invalid_request`);
    }

    try {
        // 액세스 토큰 요청
        const tokenUrlResponse = await axios.post(tokenUrl as string, {
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUrl,
            grant_type: "authorization_code",
        });

        // 사용자 정보 요청
        const userInfoUrlResponse = await axios.get(userInfoUrl as string, {
            headers: {
                Authorization: `Bearer ${tokenUrlResponse.data.access_token}`,
            },
        });

        const { id, email, name, picture } = userInfoUrlResponse.data;
        const found = await UserModel.findById(id);

        if (!found) {
            const newUser = new UserModel({
                _id: id,
                email,
                name,
                provider: "Google",
                providerId: id,
                profileImage: picture,
            });

            await newUser.save();
        }

        // JWT 토큰 생성
        console.log("토큰토큰", tokenUrlResponse.data.access_token);
        const token = createJwtToken(id, tokenUrlResponse.data.access_token);

        // 클라이언트 앱으로 리디렉션
        res.redirect(`${config.clientUrl}/login?token=${token}&id=${id}`); // 클라이언트 URL을 입력하세요
    } catch (e) {
        handleError(res, e);
    }
};


export const signOutUser = async (req: Request, res: Response) => {
    // 사용자 토큰 및 ID를 가져옵니다.
    const { userId, oauthToken } = res.locals;

    console.log("과연 제발...", oauthToken);
    if (!oauthToken) {
        return res.status(401).send('인증 토큰이 필요합니다.');
    }

    try {
        // Google API에 사용자 삭제 요청
        await axios.get(`https://accounts.google.com/o/oauth2/revoke?token=${oauthToken}`);

        // 로컬 데이터베이스에서 사용자 정보 삭제
        await UserModel.findByIdAndDelete(userId);

        // 클라이언트에게 성공 응답
        res.status(204).send(); // 성공적으로 삭제된 경우 No Content 반환
    } catch (error) {
        console.error('회원 탈퇴 중 오류 발생:', error);
        res.status(500).send('회원 탈퇴 중 문제가 발생했습니다.');
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const { userId } = res.locals; // URL 파라미터에서 사용자 ID를 가져옵니다.
        const user = await UserModel.findById(userId);

        if (!user) {
            throw new CustomError(ErrorDefinitions.NOT_FOUND);
        }
        return res.status(200).json(user);
    } catch (e) {
        handleError(res, e);
    }
};

export const getBaseWorkout = async (req: Request, res: Response) => {
    try {
        const workouts = await WorkoutLibraryModel.find({ isEditable: false });
        if (!workouts) {
            throw new CustomError(ErrorDefinitions.NOT_FOUND);
        }
        return res.status(200).json(workouts);
    } catch (e) {
        handleError(res, e);
    }
};

export const syncData = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // 클라이언트에서 보낸 모든 데이터 가져오기
        const { routineConfigs, routineRecords, workoutLibraries } = req.body;
        const { userId } = res.locals; // 현재 사용자 ID 가져오기

        // if (!isValidObjectId(userId)) {
        //     throw new CustomError(ErrorDefinitions.INVALID_DATA);
        // }

        // RoutineConfigModel 동기화
        const routineConfigOps = routineConfigs.map((routineConfig: any) => ({
            updateOne: {
                filter: { _id: routineConfig._id, userId }, // 사용자 ID로 필터링
                update: { $set: routineConfig }, // 기존 문서 업데이트
                upsert: true, // 문서가 없으면 새로 생성
            },
        }));

        // 클라이언트의 데이터를 서버에 추가하거나 업데이트
        await RoutineConfigModel.bulkWrite(routineConfigOps);

        // RoutineRecordModel 동기화
        const routineRecordOps = routineRecords.map((routineRecord: any) => ({
            updateOne: {
                filter: { _id: routineRecord._id, userId }, // 사용자 ID로 필터링
                update: { $set: routineRecord }, // 기존 문서 업데이트
                upsert: true, // 문서가 없으면 새로 생성
            },
        }));

        // 클라이언트의 데이터를 서버에 추가하거나 업데이트
        await RoutineRecordModel.bulkWrite(routineRecordOps);

        // WorkoutLibraryModel 동기화
        const workoutLibraryOps = workoutLibraries.map(
            (workoutLibrary: any) => ({
                updateOne: {
                    filter: { _id: workoutLibrary._id }, // 사용자 ID로 필터링
                    update: { $set: workoutLibrary }, // 기존 문서 업데이트
                    upsert: true, // 문서가 없으면 새로 생성
                },
            })
        );

        // 클라이언트의 데이터를 서버에 추가하거나 업데이트
        await WorkoutLibraryModel.bulkWrite(workoutLibraryOps);

        // 사용자 ID에 해당하는 업데이트된 데이터 조회
        const updatedRoutineConfigs = await RoutineConfigModel.find({ userId });
        const updatedRoutineRecords = await RoutineRecordModel.find({ userId });
        const updatedWorkoutLibraries = await WorkoutLibraryModel.find({
            userId,
        });

        // 성공적으로 가져온 경우
        res.status(200).json({
            routineConfigs: updatedRoutineConfigs, // 업데이트된 데이터를 반환
            routineRecords: updatedRoutineRecords,
            workoutLibraries: updatedWorkoutLibraries,
        });
    } catch (e) {
        handleError(res, e);
    }
};

export const deleteRoutineConfig = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { routineConfigId } = req.params;

        if (!routineConfigId) {
            throw new CustomError(ErrorDefinitions.INVALID_DATA);
        }
        // MongoDB에서 문서 삭제
        const deletedConfig = await RoutineConfigModel.findOneAndDelete({
            _id: routineConfigId,
        });

        res.status(200).json(deletedConfig);
    } catch (e) {
        handleError(res, e);
    }
};

export const deleteRoutineRecord = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { routineRecordId } = req.params;

        if (!routineRecordId) {
            throw new CustomError(ErrorDefinitions.INVALID_DATA);
        }

        const deletedRecord = await RoutineRecordModel.findOneAndDelete({
            _id: routineRecordId,
        });

        res.status(200).json(deletedRecord);
    } catch (e) {
        handleError(res, e);
    }
};

export const deleteWorkoutLibrary = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { workoutLibraryId } = req.params;

        if (!workoutLibraryId) {
            throw new CustomError(ErrorDefinitions.INVALID_DATA);
        }

        const deletedWorkoutLibrary =
            await WorkoutLibraryModel.findOneAndDelete({
                _id: workoutLibraryId,
            });

        res.status(200).json(deletedWorkoutLibrary);
    } catch (e) {
        handleError(res, e);
    }
};

export const uploadImage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const file = req.file; // single 파일 업로드의 경우
    if (!file) {
        throw new CustomError(ErrorDefinitions.INVALID_DATA);
    }

    try {
        let processedBuffer;
        let firstFrameBuffer;

        if (file.mimetype === "image/gif") {
            // GIF에서 첫 프레임 추출 후 리사이즈
            firstFrameBuffer = await sharp(file.buffer)
                .png() // GIF를 PNG로 변환
                .toBuffer();

            // 첫 프레임 리사이즈
            firstFrameBuffer = await sharp(firstFrameBuffer)
                .resize({ width: 800, height: 800, fit: "inside" }) // 리사이즈
                .jpeg({ quality: 80 })
                .toBuffer();

            // 리사이즈 및 압축한 GIF
            processedBuffer = file.buffer;
        } else {
            // 다른 이미지 포맷에 대해 압축 및 리사이즈
            processedBuffer = await sharp(file.buffer)
                .resize({ width: 800, height: 800, fit: "inside" }) // 비율에 맞춰 리사이즈
                .jpeg({ quality: 80 }) // JPEG로 변환 및 품질 설정
                .toBuffer();
        }

        // 첫 프레임을 S3에 업로드

        const firstFrameParams = {
            Bucket: config.s3.bucket as string,
            Key: `uploads/first-frames/${Date.now()}_${
                file.originalname.split(".")[0]
            }_first_frame.png`,
            Body: firstFrameBuffer,
            ContentType: "image/png",
            ACL: "public-read",
        };

        const thumbnail =
            firstFrameBuffer && (await s3.upload(firstFrameParams).promise());

        // 리사이즈된 GIF 또는 다른 이미지 파일을 S3에 업로드
        const processedParams = {
            Bucket: config.s3.bucket as string,
            Key: `uploads/processed/${Date.now()}_${file.originalname}`,
            Body: processedBuffer,
            ContentType:
                file.mimetype === "image/gif" ? "image/gif" : file.mimetype,
            ACL: "public-read",
        };

        const original = await s3.upload(processedParams).promise();

        console.log(thumbnail, original);

        res.status(200).json({
            message: "Files uploaded successfully.",
            data: {
                thumbnail: thumbnail ? thumbnail.Location : original.Location,
                original: original.Location,
            },
        });
    } catch (e) {
        handleError(res, e);
    }
};

// 푸시 토큰 저장 함수
export const savePushToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { token } = req.body; // 사용자 ID와 토큰을 요청 본문에서 가져옵니다.
    const { userId } = res.locals;

    if (!userId || !token) {
        throw new CustomError(ErrorDefinitions.INVALID_DATA);
    }

    try {
        // 사용자 정보를 업데이트하여 푸시 토큰 저장
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { pushToken: token }, // 푸시 토큰 업데이트
            { new: true } // 업데이트된 문서 반환
        );

        if (!updatedUser) {
            throw new CustomError(ErrorDefinitions.NOT_FOUND);
        }

        res.status(200).json({
            user: updatedUser,
        });
    } catch (e) {
        handleError(res, e);
    }
};

export const sendPushAlarm = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { title, body } = req.body; // 클라이언트로부터 userId, title, body를 가져옵니다.
    const { userId } = res.locals;

    if (!userId || !title || !body) {
        throw new CustomError(ErrorDefinitions.INVALID_DATA);
    }

    try {
        // 사용자 정보를 가져와 푸시 토큰을 확인합니다.
        const user = await UserModel.findById(userId);

        if (!user || !user.pushToken) {
            throw new CustomError(ErrorDefinitions.NOT_FOUND);
        }

        // Expo 푸시 알림 API 호출을 위한 body 설정
        const pushMessage = {
            to: user.pushToken, // 사용자의 푸시 토큰
            sound: "default",
            title: title, // 클라이언트에서 받은 제목
            body: body, // 클라이언트에서 받은 본문
            data: { someData: "goes here" }, // 추가 데이터 (필요시)
        };

        // Expo 푸시 알림 API 호출
        const response = await axios.post(
            "https://exp.host/--/api/v2/push/send",
            pushMessage
        );

        res.status(200).json({
            notificationResponse: response.data,
        });
    } catch (e) {
        handleError(res, e);
    }
};
