import { Request, Response } from "express";
import { config } from "../config";
import axios from "axios";
import * as userRepository from "../model/user";
import { createJwtToken } from "../util";

export const loginUser = async (req: Request, res: Response) => {
  const { clientId, redirectUrl } = config.oauth.google;
  let url = "https://accounts.google.com/o/oauth2/v2/auth";
  url += `?client_id=${clientId}`;
  url += `&redirect_uri=${redirectUrl}`;
  url += "&response_type=code";
  url += "&scope=email profile";
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
  const found = await userRepository.getOneById(id);

  if (!found) {
    await userRepository.createOne({
      id,
      email,
      name,
      picture,
    });
  }

  //TODO: 유저의 정보를 업데이트 해주어 소셜네트워크와 동기화 시켜준다.

  const token = createJwtToken(id);

  res.status(201).json({ token, id });
};
