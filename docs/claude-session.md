# Claude Session Info

이 문서는 `Portfolio-Project` 레포에서 사용할 **고정 Claude 세션** 정보를 기록한다.

## Dedicated session

- **Session ID:** `efa46938-6073-4106-aed4-efb121773f8d`
- **Scope:** `/home/lagoon3/.openclaw/workspace/Portfolio-Project`
- **Purpose:** 포트폴리오 프로젝트 작업을 Claude와 이어서 진행할 때 같은 세션 컨텍스트를 재사용

## Usage

새 작업이 아니라 기존 Claude 컨텍스트를 이어서 쓰고 싶을 때는 아래 형태를 사용한다.

```bash
claude --permission-mode bypassPermissions \
  --resume efa46938-6073-4106-aed4-efb121773f8d \
  --print "여기에 이어서 할 작업 지시"
```

새 세션을 만들지 않고 같은 세션에 이어붙이는 것이 원칙이다.

## Notes

- 작업 디렉토리는 반드시 `Portfolio-Project` 루트를 기준으로 사용한다.
- 장기 작업 중에도 같은 세션 ID를 우선 재사용한다.
- 세션이 꼬였다고 판단될 때만 새 세션을 만들고, 그 경우 이 문서를 갱신한다.
