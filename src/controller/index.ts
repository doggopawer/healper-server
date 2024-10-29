import { NextFunction, Request, Response } from "express";
import { config } from "../config";
import axios from "axios";
import { createJwtToken } from "../util";
import UserModel from "../model/user";
import RoutineConfigModel from "../model/routine-config";
import RoutineRecordModel from "../model/routine-record";
import WorkoutLibraryModel from "../model/workout-library";

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
    const { code } = req.query;

    const tokenUrlResponse = await axios.post(tokenUrl as string, {
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUrl,
        grant_type: "authorization_code",
    });

    const userInfoUrlResponse = await axios.get(userInfoUrl as string, {
        headers: {
            Authorization: `Bearer ${tokenUrlResponse.data.access_token}`,
        },
    });

    const { id, email, name, picture } = userInfoUrlResponse.data;
    const found = await UserModel.findById(id);

    if (!found) {
        const newUser = new UserModel({
            _id: id, // Mongoose에서는 _id 필드를 사용합니다.
            email,
            name,
            provider: "Google",
            providerId: id,
            profileImage: picture, // profileImage 필드에 picture 값을 할당합니다.
        });

        await newUser.save();
    }

    //TODO: 유저의 정보를 업데이트 해주어 소셜네트워크와 동기화 시켜준다.

    const token = createJwtToken(id);
    console.log(token);
    res.status(201).json({ token, id });
};

export const syncData = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // 클라이언트에서 보낸 모든 데이터 가져오기
        const { routineConfigs, routineRecords, workoutLibraries } = req.body;

        // RoutineConfigModel 동기화
        const routineConfigOps = routineConfigs.map((routineConfig: any) => ({
            updateOne: {
                filter: { _id: routineConfig._id }, // 고유 키로 필터링
                update: { $set: routineConfig }, // 기존 문서 업데이트
                upsert: true, // 문서가 없으면 새로 생성
            },
        }));

        // 클라이언트의 데이터를 서버에 추가하거나 업데이트
        await RoutineConfigModel.bulkWrite(routineConfigOps);

        // 클라이언트에서 받은 _id 목록
        const routineConfigIds = routineConfigs.map(
            (config: any) => config._id
        );

        // 클라이언트에 없는 ID를 가진 서버의 데이터를 삭제
        await RoutineConfigModel.deleteMany({
            _id: { $nin: routineConfigIds }, // 클라이언트에 없는 ID 삭제
        });

        // RoutineRecordModel 동기화
        const routineRecordOps = routineRecords.map((routineRecord: any) => ({
            updateOne: {
                filter: { _id: routineRecord._id }, // 고유 키로 필터링
                update: { $set: routineRecord }, // 기존 문서 업데이트
                upsert: true, // 문서가 없으면 새로 생성
            },
        }));

        // 클라이언트의 데이터를 서버에 추가하거나 업데이트
        const record = await RoutineRecordModel.bulkWrite(routineRecordOps);

        console.log("RoutineRecord Result:", record);

        // 클라이언트에서 받은 _id 목록
        const routineRecordIds = routineRecords.map(
            (record: any) => record._id
        );

        // 클라이언트에 없는 ID를 가진 서버의 데이터를 삭제
        await RoutineRecordModel.deleteMany({
            _id: { $nin: routineRecordIds }, // 클라이언트에 없는 ID 삭제
        });

        // WorkoutLibraryModel 동기화
        const workoutLibraryOps = workoutLibraries.map(
            (workoutLibrary: any) => ({
                updateOne: {
                    filter: { _id: workoutLibrary._id }, // 고유 키로 필터링
                    update: { $set: workoutLibrary }, // 기존 문서 업데이트
                    upsert: true, // 문서가 없으면 새로 생성
                },
            })
        );

        // 클라이언트의 데이터를 서버에 추가하거나 업데이트
        await WorkoutLibraryModel.bulkWrite(workoutLibraryOps);

        // 클라이언트에서 받은 _id 목록
        const workoutLibraryIds = workoutLibraries.map(
            (library: any) => library._id
        );

        // 클라이언트에 없는 ID를 가진 서버의 데이터를 삭제
        await WorkoutLibraryModel.deleteMany({
            _id: { $nin: workoutLibraryIds }, // 클라이언트에 없는 ID 삭제
        });

        // 성공적으로 가져온 경우
        res.status(200).json({
            message: "Data synchronized successfully",
        });
    } catch (error) {
        console.error(error); // 에러 로그
        res.status(500).json({ message: "Internal server error", error });
    }
};
