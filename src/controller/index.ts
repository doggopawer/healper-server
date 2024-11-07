import { NextFunction, Request, Response } from "express";
import { config } from "../config";
import axios from "axios";
import { createJwtToken } from "../util";
import UserModel from "../model/user";
import RoutineConfigModel from "../model/routine-config";
import RoutineRecordModel from "../model/routine-record";
import WorkoutLibraryModel from "../model/workout-library";
import s3 from "../s3";
import { ManagedUpload } from "aws-sdk/clients/s3";

export const checkAccessToken = async (req: Request, res: Response) => {
    try {
        res.status(200).json({ message: "access token is valid" });
    } catch (error) {
        console.error("Error deleting routine record:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { clientId, redirectUrl } = config.oauth.google;
    let url = "https://accounts.google.com/o/oauth2/v2/auth";
    url += `?client_id=${clientId}`;
    url += `&redirect_uri=${redirectUrl}`;
    url += "&response_type=code";
    url += "&scope=email profile";
    console.log("loginUser");
    res.redirect(url);
};

export const loginRedirectUser = async (req: Request, res: Response) => {
    const { clientId, clientSecret, redirectUrl, tokenUrl, userInfoUrl } =
        config.oauth.google;
    const { code, error } = req.query;

    // 에러 처리
    if (error === "access_denied") {
        // 사용자가 로그인을 취소한 경우
        return res.redirect(`http://localhost:3000/login?error=access_denied`);
    }

    if (!code) {
        // code가 없는 경우, 잘못된 요청 처리
        return res.redirect(
            `http://localhost:3000/login?error=invalid_request`
        );
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
        const token = createJwtToken(id);

        // 클라이언트 앱으로 리디렉션
        res.redirect(`http://localhost:3000/login?token=${token}&id=${id}`); // 클라이언트 URL을 입력하세요
    } catch (error) {
        console.error("Error during OAuth process:", error);
        res.status(500).send("Internal Server Error");
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const { userId } = res.locals; // URL 파라미터에서 사용자 ID를 가져옵니다.

        // 사용자 조회
        const user = await UserModel.findById(userId);

        if (!user) {
            return res
                .status(404)
                .json({ message: "사용자를 찾을 수 없습니다." });
        }

        // 사용자 정보 반환
        return res.status(200).json(user);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "서버 오류가 발생했습니다." });
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
        console.log(userId);

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
        const record = await RoutineRecordModel.bulkWrite(routineRecordOps);
        console.log("RoutineRecord Result:", record);

        // WorkoutLibraryModel 동기화
        const workoutLibraryOps = workoutLibraries.map(
            (workoutLibrary: any) => ({
                updateOne: {
                    filter: { _id: workoutLibrary._id, userId }, // 사용자 ID로 필터링
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
            message: "Data synchronized successfully",
            routineConfigs: updatedRoutineConfigs, // 업데이트된 데이터를 반환
            routineRecords: updatedRoutineRecords,
            workoutLibraries: updatedWorkoutLibraries,
        });
    } catch (error) {
        console.error(error); // 에러 로그
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const deleteRoutineConfig = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { routineConfigId } = req.params;

        // MongoDB에서 문서 삭제
        const deletedConfig = await RoutineConfigModel.findOneAndDelete({
            _id: routineConfigId,
        });
        console.log(routineConfigId, deletedConfig);

        // if (!deletedConfig) {
        //     return res
        //         .status(404)
        //         .json({ message: "Routine config not found" });
        // }

        res.status(200).json(deletedConfig);
    } catch (error) {
        console.error("Error deleting routine config:", error); // 오류 로그
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const deleteRoutineRecord = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { routineRecordId } = req.params;

        const deletedRecord = await RoutineRecordModel.findOneAndDelete({
            _id: routineRecordId,
        });

        // if (!deletedRecord) {
        //     return res
        //         .status(404)
        //         .json({ message: "Routine record not found" });
        // }

        res.status(200).json(deletedRecord);
    } catch (error) {
        console.error("Error deleting routine record:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const deleteWorkoutLibrary = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { workoutLibraryId } = req.params;

        const deletedWorkoutLibrary =
            await WorkoutLibraryModel.findOneAndDelete({
                _id: workoutLibraryId,
            });

        console.log(deletedWorkoutLibrary, "머야");

        if (!deletedWorkoutLibrary) {
            return res
                .status(404)
                .json({ message: "workout library not found" });
        }

        res.status(200).json(deletedWorkoutLibrary);
    } catch (error) {
        console.error("Error deleting routine record:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

export const uploadImage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Multer가 처리한 파일 정보에 접근
    const file = req.file; // single 파일 업로드의 경우
    if (!file) {
        return res.status(400).send("No file uploaded.");
    }
    console.log(file);

    const params = {
        Bucket: config.s3.bucket as string,
        Key: `uploads/${Date.now()}_${file.originalname}`, // 원래 파일 이름 사용
        Body: file.buffer, // 파일의 버퍼
        ContentType: file.mimetype, // 파일의 MIME 타입
        ACL: "public-read",
    };

    s3.upload(params, (error: Error, data: ManagedUpload.SendData) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.status(200).json(data);
    });
};
