// s3.ts
import S3 from "aws-sdk/clients/s3";
import { config } from "./config";

// S3 클라이언트 설정
const s3 = new S3({
    accessKeyId: config.s3.accessKey, // IAM 사용자에서 받은 Access Key
    secretAccessKey: config.s3.secretAccessKey, // IAM 사용자에서 받은 Secret Access Key
    region: config.s3.region, // S3 버킷의 리전 (예: 'us-east-1')
});

export default s3; // S3 클라이언트를 기본으로 내보냅니다.
