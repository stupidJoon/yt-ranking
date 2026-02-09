# terraform

여러 AWS 리전에 lambda 배포를 위한 terraform 입니다.

1. `lambda` 디렉토리에서 `npm ci`
2. aws key 설정과 필요시 terraform cloud 설정
3. `terraform plan` 명령으로 예상 결과 확인
4. `terraform apply` 명령으로 aws에 배포

- `terraform destroy` 명령으로 aws 서비스 제거 가능
