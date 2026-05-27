-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: portfolio
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `PROJECT`
--

DROP TABLE IF EXISTS `PROJECT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PROJECT` (
  `id` int NOT NULL AUTO_INCREMENT,
  `url` varchar(200) NOT NULL,
  `title` varchar(200) NOT NULL,
  `category` varchar(100) NOT NULL,
  `thumbnail_img` varchar(500) NOT NULL,
  `header_publish_date` varchar(100) NOT NULL,
  `header_tags` varchar(200) NOT NULL,
  `client_heading` varchar(200) NOT NULL,
  `objectives_heading` varchar(200) NOT NULL,
  `objectives_details` text NOT NULL,
  `project_details_heading` varchar(200) NOT NULL,
  `social_sharing_heading` varchar(200) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `hero_subtitle` varchar(255) DEFAULT NULL,
  `hero_accent_word` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_de3db186421162db8d6a8bf14e` (`url`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROJECT`
--

LOCK TABLES `PROJECT` WRITE;
/*!40000 ALTER TABLE `PROJECT` DISABLE KEYS */;
INSERT INTO `PROJECT` VALUES (1,'unified-log-system','통합 로그 시스템','Backend / Data Pipeline','/uploads/181ad845-4357-47bb-9f58-b1dd00d58b24.jpg','2026.01 – 2026.03','Backend / Infra / Data Pipeline','About Project','Objective','EPP · EDR · MDS 보안 로그를 공통 스키마로 모으고, 대시보드 · Teams 알림 · 자연어 조회까지 한 흐름으로 묶은 통합 로그 파이프라인.','Challenge','Share This Project','2026-04-20 17:08:10.501452','EPP / EDR / MDS 보안 로그를 한 기준으로 정규화하고, 자연어 조회까지 연결한 통합 파이프라인.','시스템'),(2,'classup-pre-consultation','클래스업 - 사전 상담 기능','Backend','/uploads/c9db04a1-fe6e-4289-a4ac-31a1160321c3.jpg','2025.10 – 2025.12','Backend / AI / RAG','About Project','Objective','학원 상담 전 학생·학부모 정보를 구조화해 모으고, 학원 내부 수업·교재만 신뢰 근거로 삼는 RAG 백엔드 기능.','Challenge','Share This Project','2026-04-20 17:08:10.595368','학원 상담 전 학생·학부모 정보를 구조화하고 RAG 로 수업·교재를 추천하는 백엔드 기능.','기능'),(3,'classup-student-timer','클래스업 학생앱 - 타이머 서비스','Backend','/uploads/0f41ae34-04f1-4fb1-ae1e-f28526530c9c.jpg','2025.08 – 2025.10','Backend / Performance / Migration','About Project','Objective','앱이 종료되거나 백그라운드여도 학습 시간이 끊기지 않게, 서버가 직접 시간을 관리하는 학생앱 타이머.','Challenge','Share This Project','2026-04-20 17:08:10.635486','앱이 꺼지거나 백그라운드여도 학습 시간이 끊기지 않게, 서버가 직접 시간을 계산하는 타이머.','서비스'),(4,'betting-duck','베팅덕 (실시간 베팅 서비스)','Web Application','/uploads/513bd7b9-a12a-4a49-baa1-ad1d1a8148c0.jpg','2024.10 – 2025.02','Backend / Realtime / Redis','About Project','Objective','실시간 베팅과 채팅, 코인 보상을 결합한 웹 서비스. Redis 기반 처리 구조로 베팅 종료와 코인 정산 흐름의 응답성을 개선했습니다.','Challenge','Share This Project','2026-04-20 17:08:10.682530','트위치 포인트 예측의 빈자리를 채운 실시간 베팅 + 채팅 + 코인 경제 웹 서비스.','서비스'),(5,'cats-chatbot','CaTs ChatBot (챗봇)','Backend / Operation','/uploads/e1b67ffc-7f2b-4d25-b5ee-1b8cd25f0269.jpg','2024.01 – 2024.05 · 운영/유지보수 약 18개월','Django / Kakao Chatbot / Backup / Crawling Optimization','About Project','Objective','동아리 가입 신청, 물품 대여, 학식 조회를 카카오톡 채널 안에서 처리할 수 있도록 만든 학술 동아리 챗봇 백엔드입니다. 초기에는 가입 신청을 간소화하는 것이 목표였지만, 운영 중 사용자 피드백을 반영해 물품 대여와 학식 정보 제공 기능까지 확장했습니다. 이후 약 18개월간 유지보수하며 장애 복구, 백업 자동화, 크롤링 최적화까지 맡았습니다.','Challenge','Share This Project','2026-04-20 17:08:10.716101','동아리 가입부터 학식 조회까지 운영한 카카오 챗봇 백엔드','Operation'),(6,'custom-web-framework','커스텀 웹 프레임워크','Web Application','/uploads/d5778a9a-ab8c-4230-94be-74e5f6d41f35.jpg','2025.03 – 2025.06','Backend / Framework / Low-level','About Project','Objective','Node.js net 모듈 위에서 HTTP 사이클을 직접 구현하고 MVC 게시판 앱까지 올린 학습용 웹 프레임워크.','Challenge','Share This Project','2026-04-20 17:08:10.757621','Node.js net 모듈 위에서 HTTP 사이클을 직접 구현하고, 그 위에 MVC 웹앱까지 올린 학습 프로젝트.','프레임워크');
/*!40000 ALTER TABLE `PROJECT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PROJECT_DETAIL`
--

DROP TABLE IF EXISTS `PROJECT_DETAIL`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PROJECT_DETAIL` (
  `id` int NOT NULL AUTO_INCREMENT,
  `details` text NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `project_id` int NOT NULL,
  `kind` varchar(50) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_168dd322342c64a5c03e5debe94` (`project_id`),
  CONSTRAINT `FK_168dd322342c64a5c03e5debe94` FOREIGN KEY (`project_id`) REFERENCES `PROJECT` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=156 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROJECT_DETAIL`
--

LOCK TABLES `PROJECT_DETAIL` WRITE;
/*!40000 ALTER TABLE `PROJECT_DETAIL` DISABLE KEYS */;
INSERT INTO `PROJECT_DETAIL` VALUES (130,'정식 회원 테이블에 귀속시키기엔 정보 불완전, 폐기하기엔 정식 등록 연계 필요. `tb_temp_user` 임시 엔터티 도입.\n\n- 상담 단계와 등록 단계의 자연스러운 분리\n- 비회원 상태 사용자의 안정적 관리\n- 등록 시 임시 데이터를 정식 프로세스로 승계',0,2,NULL,NULL),(131,'MySQL ngram full-text 는 정보량 많은 문서가 우선 노출되는 한계. RAG 흐름으로 전환.\n\n- 상담 정보 ↔ 수업·교재를 MongoDB Vector Search 로 매칭\n- 검색 결과를 OpenAI 컨텍스트로 전달\n- 키워드 매칭 대신 문맥 기반 추천 생성',1,2,NULL,NULL),(132,'자유 생성 대신 응답 스키마 고정 + 서버 단 검증 단계 도입. 실제 서비스에 안정적으로 사용 가능한 형태로.',2,2,NULL,NULL),(133,'상담 전 수집 정보 구조화로 담당자별 품질 편차 해소. AI 요약·추천 결과를 검수 후 활용하는 운영 흐름 정착.',3,2,NULL,NULL),(134,'클라이언트 의존 시 화면 닫힘 / 앱 종료에서 신뢰성 ↓. 서버 중심 흐름으로 전환.\n\n- 시작 시 `startedAt` 저장\n- 조회 시 `현재 시각 - startedAt` 으로 경과 시간 계산\n- 종료 시 `durationSec` 확정 저장\n\n클라이언트 상태와 무관하게 학습 시간 신뢰 확보.',0,3,NULL,NULL),(135,'동시 다중 타이머는 학습 시간 중복 누적 위험. `tb_user_timer_status` 의 유니크 제약으로 사용자별 활성 타이머 1개만 허용.',1,3,NULL,NULL),(136,'`userId` 단일 인덱스 + offset 페이지네이션 → 데이터 누적 시 조회 ↓. 두 가지 동시 적용.\n\n- `userId + startedAt` 복합 인덱스 추가\n- `startedAt` 기준 키셋 페이지네이션\n\nexplain 기준 주요 쿼리 **77% 단축**.',2,3,NULL,NULL),(137,'운영 환경 DynamoDB 로 전환. Mongoose Hook 으로 UTC ↔ KST 자동 변환 — 시간대 차이로 다른 날짜에 기록 저장되던 문제 해소.',3,3,NULL,NULL),(138,'Redis List + Pub/Sub 으로 메시지 큐 구성.\n\n- List 로 메시지 순차 처리\n- Pub/Sub 으로 특정 시점 소비\n- ACK Timeout 으로 미처리 메시지 감지·재처리\n\n베팅 종료 후 사용자별 오리 코인 업데이트에 사용.',0,4,NULL,NULL),(139,'Redis 전체 키 탐색 알고리즘이 응답 지연 원인. 두 가지 동시 적용.\n\n- 큐에 필요한 정보 직접 저장으로 즉시 반영\n- 메시지 큐로 비동기 DB IO 분리',1,4,NULL,NULL),(140,'비회원 로그인 시 `익명의 ~` 자동 prefix. 동일 IP 동일 닉네임 유지 제약으로 여러 ID 부당 베팅 참여 방지.',2,4,NULL,NULL),(144,'`http` 모듈 추상화 대신 더 하위 레벨의 `net` 모듈 사용. 네트워크 레벨에서 직접 다룬 항목.\n\n- 헤더 / 바디 파싱\n- 여러 chunk 로 나뉜 요청 수신\n- 스트림 flow 모드 전환 시점 제어\n- `data` / `end` 이벤트 기반 body 수집',0,6,NULL,NULL),(145,'헤더와 바디가 동일 chunk 에 섞이거나 여러 chunk 로 나뉘던 문제. 다음 흐름으로 안정화.\n\n- `\\r\\n\\r\\n` 기준으로 헤더와 바디 분리\n- 헤더 직후 남은 body 조각을 별도 버퍼링\n- 이후 chunk 누적 → `Content-Length` 기준 완료 판단\n\nJSON 요청은 물론 대용량 파일 스트리밍도 안정 수신.',1,6,NULL,NULL),(146,'Redis vs 인메모리 캐시 비교 측정으로 정적 파일·API 응답 캐싱 전략 결정. Lua Script 로 조회수 increment 원자성 보장.',2,6,NULL,NULL),(147,'Express 유사 구조로 프레임워크 코어 구현.\n\n- `Application` / `Router` / `Middleware` / `Request` / `Response` 직접 설계\n- 전역 / 경로별 미들웨어, 동적 라우팅 지원\n- 정적 파일 서빙, Redis 세션 저장 지원\n\nMVC 게시판 (CRUD · 세션 인증 · 파일 업로드) 을 올려 프레임워크 계층 - 서비스 로직 분리를 실제로 검증.',3,6,NULL,NULL),(148,'EPP / EDR / MDS 가 syslog 로 들어와도 메시지 형식은 전부 다름. 아래 공통 필드로 정규화해 같은 기준으로 필터링·집계 가능하게 함.\n\n- `service` — 어느 솔루션에서 왔는지\n- `risk` — 탐지된 위협 수준\n- `syslog_type` — 장비별 이벤트 유형\n- `parse_status` — 파싱 성공 / 부분 / 실패 상태',0,1,NULL,NULL),(149,'수집 책임과 파싱 책임을 분리해서 가져감.\n\n- `syslog-ng` — 수집 + disk-buffer 기반 안정성\n- `Vector` — VRL 기반 라우팅 / 파싱 / Loki 적재 / 알림 분기\n\n수집 계층은 안정 유지, 파싱 로직은 빠르게 변경 가능한 구조.',1,1,NULL,NULL),(150,'NestJS 기반 별도 MCP 앱 + Loki 질의 도구 구성.\n\n- 헥사고날 아키텍처 (`inbound` / `application` / `outbound`) 분리\n- HTTP `/rpc` + stdio 두 transport 모두 지원\n- Loki 직접 질의 클라이언트를 두고 usecase 단위로 도구 분리',2,1,NULL,NULL),(151,'Grafana 알림 대신 NestJS API 가 직접 Teams Webhook 전송. 메시지에 다음 정보를 포함해 운영자 즉시 인지.\n\n- 사용자 / IP / 발생 시각\n- 악성 파일명 또는 탐지명\n- 서비스 / 위험도',3,1,NULL,NULL),(152,'시나리오 테스트 기준 로그 확인 과정 **86% 단축**. 수작업 5단계 반복 조회 → 자연어 질의 1회 흐름으로 단순화.',4,1,NULL,NULL),(153,'동아리 지원자 정보가 관리자 페이지에서 실수로 삭제되는 문제가 있었습니다. 당시 Django 로그를 추적해 데이터를 복구했고, 이후 같은 문제가 반복돼도 대응할 수 있도록 백업 체계를 만들었습니다.\n\n- Django 로그 기반 삭제 데이터 추적 및 복구\n- `mysqldump` 기반 정기 백업 스크립트 작성\n- `cron`으로 주기 실행\n- 생성된 SQL 백업 파일을 NAS에 저장',0,5,'RECOVERY','운영 중 사고를 복구 가능한 구조로 바꾼 경험'),(154,'학식 정보 조회는 처음에 Selenium 기반 동적 크롤링으로 구현되어 CLI 환경에서 무겁고 느렸습니다. 네트워크 요청을 분석해 실제 데이터 API를 찾고, `requests` 기반 호출로 전환했습니다.\n\n- 기존 Selenium 크롤링: 약 `2300ms`\n- 개선 후 API 직접 호출: 약 `170ms`\n- 약 `93%` 응답 시간 단축\n- CLI 서버 환경에 더 적합한 구조로 변경',1,5,'OPTIMIZATION','Selenium 크롤링을 API 호출로 바꿔 응답 시간을 줄인 경험'),(155,'초기 목표는 동아리 가입 신청을 카카오톡 안에서 처리하는 것이었습니다. 이후 실제 사용자 피드백을 반영해 물품 대여와 학식 조회 기능을 추가했고, 약 18개월간 백엔드 운영과 유지보수를 맡았습니다.\n\n- 가입 신청 기능 구현\n- 물품 대여 기능 추가\n- 학식 조회 기능 추가\n- 약 18개월 운영·유지보수\n- 인수인계 후 현재도 운영 가능한 구조로 정리',2,5,'OPERATION','작은 서비스를 오래 운영하며 기능을 확장한 경험');
/*!40000 ALTER TABLE `PROJECT_DETAIL` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PROJECT_STAT`
--

DROP TABLE IF EXISTS `PROJECT_STAT`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PROJECT_STAT` (
  `id` int NOT NULL AUTO_INCREMENT,
  `label` varchar(100) NOT NULL,
  `value` varchar(100) NOT NULL,
  `sub` varchar(255) DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `project_id` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_project_stat_project` (`project_id`),
  CONSTRAINT `FK_project_stat_project` FOREIGN KEY (`project_id`) REFERENCES `PROJECT` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROJECT_STAT`
--

LOCK TABLES `PROJECT_STAT` WRITE;
/*!40000 ALTER TABLE `PROJECT_STAT` DISABLE KEYS */;
INSERT INTO `PROJECT_STAT` VALUES (24,'Query latency','-77%','복합 인덱스 + 키셋 페이지네이션',0,3,'2026-05-26 23:07:40.411844'),(28,'Log lookup','-86%','10–15분 → 1–2분',0,1,'2026-05-26 23:28:31.183291'),(29,'Maintenance','18mo','운영·유지보수',0,5,'2026-05-27 11:39:05.153604'),(30,'Crawling Cut','93%','2300ms → 170ms',1,5,'2026-05-27 11:39:05.153604'),(31,'Recovery Ready','Backup','로그 복구 후 정기 백업 도입',2,5,'2026-05-27 11:39:05.153604');
/*!40000 ALTER TABLE `PROJECT_STAT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PROJECT_QUOTE`
--

DROP TABLE IF EXISTS `PROJECT_QUOTE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PROJECT_QUOTE` (
  `id` int NOT NULL AUTO_INCREMENT,
  `text` text NOT NULL,
  `author` varchar(200) DEFAULT NULL,
  `project_id` int NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `UQ_project_quote_project` (`project_id`),
  CONSTRAINT `FK_project_quote_project` FOREIGN KEY (`project_id`) REFERENCES `PROJECT` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROJECT_QUOTE`
--

LOCK TABLES `PROJECT_QUOTE` WRITE;
/*!40000 ALTER TABLE `PROJECT_QUOTE` DISABLE KEYS */;
INSERT INTO `PROJECT_QUOTE` VALUES (18,'RAG 는 검색 결과를 LLM 에 넘기는 작업이 아니라, 어떤 데이터를 신뢰할지 정하는 일이다.','프로젝트 회고',2,'2026-05-26 23:06:27.904264'),(19,'UI 가 멈춰도 시간은 흐른다. 신뢰할 수 있는 시계는 서버에 두기로 했다.','프로젝트 회고',3,'2026-05-26 23:07:40.410168'),(20,'서비스가 없어진 자리에 직접 만들어 본다는 동기가 가장 강한 학습 동력이었다.','프로젝트 회고',4,'2026-05-26 23:08:31.405650'),(22,'프레임워크를 사용한다는 것과 만든다는 것 사이엔, 디버깅 가능한 추상화의 깊이가 있다.','프로젝트 회고',6,'2026-05-26 23:17:28.836530'),(23,'로그를 모으는 것보다 어려운 건, 다른 형태의 데이터를 같은 기준으로 보게 만드는 일이었다.','프로젝트 회고',1,'2026-05-26 23:28:31.181313'),(24,'복구에서 끝내지 않고, 다시 복구할 수 있는 구조를 남겼습니다.','프로젝트 회고',5,'2026-05-27 11:39:05.154140');
/*!40000 ALTER TABLE `PROJECT_QUOTE` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-27 12:16:26
