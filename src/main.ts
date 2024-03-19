import { sequelize } from "./db";
import express from "express";
import { RoutineConfig } from "./model/RoutineConfig";
import { RoutineRecord } from "./model/RoutineRecord";
import { SetConfig } from "./model/SetConfig";
import { SetRecord } from "./model/SetRecord";
import { User } from "./model/User";
import { WorkoutConfig } from "./model/WorkoutConfig";
import { WorkoutLibrary } from "./model/WorkoutLibrary";
import { WorkoutRecord } from "./model/WorkoutRecord";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import axios from "axios";
import { config } from "./config";
import UserRouter from "./routes/User";
import WorkoutLibraryRouter from "./routes/workout-library";
import RoutineConfigRouter from "./routes/routine-config";
import WorkoutConfigRouter from "./routes/workout-config";
import SetConfigRouter from "./routes/set-config";
import RoutineRecordRouter from "./routes/routine-record";
import WorkoutRecordRouter from "./routes/workout-record";
import SetRecordRouter from "./routes/set-record";

User;
RoutineConfig;
RoutineRecord;
SetConfig;
SetRecord;
WorkoutConfig;
WorkoutRecord;
WorkoutLibrary;

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));

app.use("/user", UserRouter);
app.use("/workout-library", WorkoutLibraryRouter);
app.use("/routine-config", RoutineConfigRouter);
app.use("/workout-config", WorkoutConfigRouter);
app.use("/set-config", SetConfigRouter);
app.use("/routine-record", RoutineRecordRouter);
app.use("/workout-record", WorkoutRecordRouter);
app.use("/set-record", SetRecordRouter);

const { clientId, clientSecret, redirectUrl, tokenUrl, userInfoUrl } =
  config.oauth.google;

// 루트 페이지
// 로그인 버튼을 누르면 GET /login으로 이동
app.get("/", (req, res) => {
  res.send(`
        <h1>Log in</h1>
        <a href="/login">Log in</a>
    `);
});

// 로그인 버튼을 누르면 도착하는 목적지 라우터
// 모든 로직을 처리한 뒤 구글 인증 서버인 https://accounts.google.com/o/oauth2/v2/auth
// 으로 redirect 되는데, 이 url에 첨부할 몇가지 QueryString들이 필요
app.get("/login", (req, res) => {
  let url = "https://accounts.google.com/o/oauth2/v2/auth";
  // client_id는 위 스크린샷을 보면 발급 받았음을 알 수 있음
  // 단, 스크린샷에 있는 ID가 아닌 당신이 직접 발급 받은 ID를 사용해야 함.
  url += `?client_id=${clientId}`;
  // 아까 등록한 redirect_uri
  // 로그인 창에서 계정을 선택하면 구글 서버가 이 redirect_uri로 redirect 시켜줌
  url += `&redirect_uri=${redirectUrl}`;
  // 필수 옵션.
  url += "&response_type=code";
  // 구글에 등록된 유저 정보 email, profile을 가져오겠다 명시
  url += "&scope=email profile";
  // 완성된 url로 이동
  // 이 url이 위에서 본 구글 계정을 선택하는 화면임.
  res.redirect(url);
});

// 구글 계정 선택 화면에서 계정 선택 후 redirect 된 주소
// 아까 등록한 GOOGLE_REDIRECT_URI와 일치해야 함
// 우리가 http://localhost:3000/login/redirect를
// 구글에 redirect_uri로 등록했고,
// 위 url을 만들 때도 redirect_uri로 등록했기 때문
app.get("/login/redirect", async (req, res) => {
  const { code } = req.query;
  console.log(`code: ${code}`);

  const resp = await axios.post(tokenUrl as string, {
    // x-www-form-urlencoded(body)
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUrl,
    grant_type: "authorization_code",
  });

  const resp2 = await axios.get(userInfoUrl as string, {
    // Request Header에 Authorization 추가
    headers: {
      Authorization: `Bearer ${resp.data.access_token}`,
    },
  });

  // 구글 인증 서버에서 json 형태로 반환 받은 body 클라이언트에 반환
  res.json(resp2.data);
});

sequelize
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log("server is running at 3000");
    });
  })
  .catch(() => {
    console.error("Unable to connect to the database.");
  });
