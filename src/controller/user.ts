import { Request, Response } from "express";
import { config } from "../config";
import axios from "axios";

const { clientId, clientSecret, redirectUrl, tokenUrl, userInfoUrl } =
  config.oauth.google;
export const loginUser = async (req: Request, res: Response) => {
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
};

export const loginRedirectUser = async (req: Request, res: Response) => {
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
};
