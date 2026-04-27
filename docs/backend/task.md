# 백엔드 작업 순서

이 문서는 현재 백엔드/데이터 작업의 진행 기준이다.
앞으로 이 스레드에서 단계 작업을 진행할 때 이 체크리스트를 기준으로 완료 여부를 갱신한다.

## 추천 진행 순서

- [x] 1. Supabase 프로젝트를 앱에 연결한다.
- [x] 2. 현재 실제 DB 테이블 관계를 확인한다.
- [x] 3. 현재 실제 DB 구조에 맞게 `docs/backend/backend.md`를 정리한다.
- [x] 4. 회원가입 시 `profiles`가 자동 생성되도록 트리거 방식을 확정한다.
- [x] 5. `profiles` 테이블 컬럼을 MVP 기준으로 확정한다.
- [x] 6. `food_items` 테이블 컬럼을 MVP 기준으로 확정한다.
- [x] 7. `food_items`의 RLS를 `select`, `insert`, `update`, `delete`까지 점검한다.
- [x] 8. 앱 시작 시 세션 확인 후 로그인 여부에 따라 분기되도록 auth 흐름을 정리한다.
- [x] 9. 회원가입 화면과 로그인 화면의 데이터 처리 로직을 연결한다.
- [x] 10. 로그인된 사용자 기준으로 `food_items` 목록 조회를 연결한다.
- [ ] 11. 식재료 추가 로직을 현재 실제 DB 구조에 맞게 연결한다.
- [ ] 12. 식재료 수정 로직을 현재 실제 DB 구조에 맞게 연결한다.
- [ ] 13. 식재료 삭제 로직을 현재 실제 DB 구조에 맞게 연결한다.
- [ ] 14. 유통기한 상태 계산이 현재 DB 필드와 맞는지 점검한다.
- [ ] 15. 바코드 저장 여부와 저장 컬럼 사용 방식을 확정한다.
- [ ] 16. 알림 기준 데이터를 어떤 필드로 계산할지 확정한다.
- [ ] 17. 완료된 DB 구조와 저장 흐름을 `docs/backend/backend.md`에 반영한다.

## 현재 상태 메모

- 완료:
  - Supabase 연결 완료
  - 실제 원격 DB 직접 조회 가능
  - 현재 `auth.users -> profiles -> food_items` 관계 확인
  - 회원가입 시 `profiles` 자동 생성을 트리거 방식으로 확정
  - `auth.users -> profiles` 자동 생성 트리거 실제 DB 적용 완료
  - `profiles`에 `phone_number`, `created_at` 컬럼 추가 완료
  - `profiles`를 `user_id` PK/FK 기준으로 단순화 완료
  - `food_items`에 `updated_at` 컬럼과 자동 갱신 트리거 추가 완료
  - `food_items`의 `select`, `insert`, `update`, `delete` RLS 정책 확인 완료
  - 앱 시작 시 세션 확인 후 인증 화면과 메인 화면 분기 연결 완료
  - 회원가입/로그인 화면과 auth 서비스 연결 완료
  - 로그인된 사용자 기준 `food_items` 목록 조회 연결 완료
- 미완료:
  - `docs/backend/backend.md`는 아직 예전 `fridges` 기반 초안이 남아 있음
  - `food_items` CRUD를 현재 실제 DB 구조에 맞게 완전히 정리하지 않음
  - 회원가입 화면은 아직 `phone_number`를 입력/전달하지 않음

## 작업 규칙

- 새 단계가 끝나면 이 문서의 체크박스를 바로 갱신한다.
- 다음 단계 작업은 사용자가 지시한 순서를 우선한다.
- 실제 DB 구조가 바뀌면 `backend.md`와 `task.md`를 함께 갱신한다.
