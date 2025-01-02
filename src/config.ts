import "dotenv/config";

type Config = {
    db: {
        host: string | undefined;
        user: string | undefined;
        password: string | undefined;
        database: string | undefined;
    };
    jwt: {
        secretKey: string | undefined;
        expiresIn: string | undefined;
    };
    oauth: {
        google: {
            clientId: string | undefined;
            clientSecret: string | undefined;
            redirectUrl: string | undefined;
            tokenUrl: string | undefined;
            userInfoUrl: string | undefined;
        };
        apple: {
            clientId: string | undefined;
            privateKey: string | undefined;
            privateKeyId: string | undefined;
            redirectUrl: string | undefined;
            teamId: string | undefined;
        }
    };
    s3: {
        accessKey: string | undefined;
        secretAccessKey: string | undefined;
        region: string | undefined;
        bucket: string | undefined;
    };
    clientUrl: string | undefined;
};

export const config: Config = {
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    },
    jwt: {
        secretKey: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.JWT_EXPIRES_IN,
    },
    oauth: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            redirectUrl: process.env.GOOGLE_REDIRECT_URL,
            tokenUrl: process.env.GOOGLE_TOKEN_URL,
            userInfoUrl: process.env.GOOGLE_USERINFO_URL,
        },
        apple: {
            clientId: process.env.APPLE_SERVICE_ID,
            privateKey: process.env.APPLE_PRIVATE_KEY,
            privateKeyId: process.env.APPLE_PRIVATE_KEY_ID,
            redirectUrl: process.env.APPLE_REDIRECT_URL,
            teamId: process.env.APPLE_TEAM_ID,
        }
    },
    s3: {
        accessKey: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
        bucket: process.env.AWS_BUCKET_NAME,
    },
    clientUrl: process.env.HEALPER_CLIENT_URL,
};
