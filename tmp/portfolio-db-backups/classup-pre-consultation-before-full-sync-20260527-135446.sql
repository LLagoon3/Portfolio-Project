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
  `hero_role` varchar(100) DEFAULT NULL,
  `hero_client` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_de3db186421162db8d6a8bf14e` (`url`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROJECT`
--

LOCK TABLES `PROJECT` WRITE;
/*!40000 ALTER TABLE `PROJECT` DISABLE KEYS */;
INSERT INTO `PROJECT` VALUES (1,'unified-log-system','통합 로그 시스템','Backend / Data Pipeline','/uploads/181ad845-4357-47bb-9f58-b1dd00d58b24.jpg','2026.01 – 2026.03','Backend / Infra / Data Pipeline','About Project','Objective','EPP · EDR · MDS 보안 로그를 공통 스키마로 모으고, 대시보드 · Teams 알림 · 자연어 조회까지 한 흐름으로 묶은 통합 로그 파이프라인.','Challenge','Share This Project','2026-04-20 17:08:10.501452','EPP / EDR / MDS 보안 로그를 한 기준으로 정규화하고, 자연어 조회까지 연결한 통합 파이프라인.','시스템','설계 · 구현 · 사내 배포',NULL),(2,'classup-pre-consultation','클래스업 - 사전 상담 기능','Backend','/uploads/c9db04a1-fe6e-4289-a4ac-31a1160321c3.jpg','2025.10 – 2025.12','Backend / AI / RAG','About Project','Objective','학원 상담 전 학생·학부모 정보를 구조화해 모으고, 학원 내부 수업·교재만 신뢰 근거로 삼는 RAG 백엔드 기능.','Challenge','Share This Project','2026-04-20 17:08:10.595368','학원 상담 전 학생·학부모 정보를 구조화하고 RAG 로 수업·교재를 추천하는 백엔드 기능.','기능','백엔드 전반 (API · DB · RAG · OpenAI 연동)',NULL),(3,'classup-student-timer','클래스업 학생앱 - 타이머 서비스','Backend / Performance','/uploads/0f41ae34-04f1-4fb1-ae1e-f28526530c9c.jpg','2025.08 – 2025.10 · 팀 프로젝트 / 백엔드 전담','Express / TypeScript / MongoDB / DynamoDB / Joi / Swagger','About Project','Objective','앱 종료·백그라운드 전환에도 학습 시간이 안정적으로 누적되도록 서버 중심 타이머 구조를 설계한 프로젝트','Challenge','Share This Project','2026-04-20 17:08:10.635486',NULL,'Timer','백엔드 전반 (타이머 API · DB 설계 · Mongo↔DynamoDB 마이그레이션)',NULL),(4,'betting-duck','베팅덕 (실시간 베팅 서비스)','Realtime Backend','/uploads/513bd7b9-a12a-4a49-baa1-ad1d1a8148c0.jpg','2024.10 – 2025.02','NestJS / Socket.IO / Redis / PostgreSQL','About Project','Objective','실시간 베팅·채팅 서비스. Redis 큐로 베팅 종료와 코인 정산 응답성을 개선했습니다.','Challenge','Share This Project','2026-04-20 17:08:10.682530','Redis 큐와 캐시 전략으로 실시간 베팅의 응답성과 정합성을 개선한 백엔드 프로젝트','Realtime','아키텍처 기획 · 백엔드 개발 · Redis 큐/캐시 · 실시간 처리 (기여도 30%)',NULL),(5,'cats-chatbot','CaTs ChatBot (챗봇)','Backend / Operation','/uploads/e1b67ffc-7f2b-4d25-b5ee-1b8cd25f0269.jpg','2024.01 – 2024.05 · 운영/유지보수 약 18개월','Django / Kakao Chatbot / Backup / Crawling Optimization','About Project','Objective','동아리 가입 신청, 물품 대여, 학식 조회를 카카오톡 채널 안에서 처리할 수 있도록 만든 학술 동아리 챗봇 백엔드입니다. 초기에는 가입 신청을 간소화하는 것이 목표였지만, 운영 중 사용자 피드백을 반영해 물품 대여와 학식 정보 제공 기능까지 확장했습니다. 이후 약 18개월간 유지보수하며 장애 복구, 백업 자동화, 크롤링 최적화까지 맡았습니다.','Challenge','Share This Project','2026-04-20 17:08:10.716101','동아리 가입부터 학식 조회까지 운영한 카카오 챗봇 백엔드','Operation','백엔드 총괄 · 동아리 서버 구축 (기여도 80%)',NULL),(6,'custom-web-framework','커스텀 웹 프레임워크','Low-level Backend','/uploads/d5778a9a-ab8c-4230-94be-74e5f6d41f35.jpg','2025.03 – 2025.06 · 개인 프로젝트 / 기여도 100%','Node.js net / HTTP / Router / Middleware / Redis','About Project','Objective','Node.js net 모듈로 HTTP 요청 처리와 프레임워크 구조를 직접 구현한 프로젝트입니다.','Challenge','Share This Project','2026-04-20 17:08:10.757621','Node.js net 모듈 위에서 HTTP 요청 사이클과 Express 유사 프레임워크 구조를 직접 구현한 프로젝트','Framework','테스트','테스트');
/*!40000 ALTER TABLE `PROJECT` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PROJECT_COMPANY_INFO`
--

DROP TABLE IF EXISTS `PROJECT_COMPANY_INFO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PROJECT_COMPANY_INFO` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `details` varchar(500) NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `project_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_b0cf36aa03560ca425deedcadcc` (`project_id`),
  CONSTRAINT `FK_b0cf36aa03560ca425deedcadcc` FOREIGN KEY (`project_id`) REFERENCES `PROJECT` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=149 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROJECT_COMPANY_INFO`
--

LOCK TABLES `PROJECT_COMPANY_INFO` WRITE;
/*!40000 ALTER TABLE `PROJECT_COMPANY_INFO` DISABLE KEYS */;
INSERT INTO `PROJECT_COMPANY_INFO` VALUES (104,'서비스','클래스업 (학원 SaaS)',0,2),(105,'팀 구성','2명 (FE 1, BE 1)',1,2),(106,'담당','백엔드 전반 (API · DB · RAG · OpenAI 연동)',2,2),(107,'기간','2025.10 ~ 2025.12',3,2),(116,'서비스','학술 동아리 CaTs 챗봇 서비스',0,5),(117,'팀 구성','2명 (FE 1, BE 1)',1,5),(118,'담당','백엔드 총괄 · 동아리 서버 구축 (기여도 80%)',2,5),(119,'기간','2024.01 ~ 2024.05 (운영·유지보수 ~2025)',3,5),(125,'프로젝트 성격','개인 프로젝트 (기여도 100%)',0,1),(126,'팀 구성','1명',1,1),(127,'담당','설계 · 구현 · 사내 배포',2,1),(128,'기간','2026.01 ~ 2026.03',3,1),(129,'배포','사내 서버, Docker Compose',4,1),(130,'서비스','실시간 베팅·채팅 서비스',0,4),(131,'팀 구성','4명 (FE 2, BE 2)',1,4),(132,'담당','아키텍처 기획 · 백엔드 개발 · Redis 큐/캐시 · 실시간 처리 (기여도 30%)',2,4),(133,'기간','2024.10 ~ 2025.02',3,4),(139,'프로젝트 성격','개인 프로젝트 (기여도 100%)',0,6),(140,'담당','프레임워크 코어 · HTTP 파서 · Router/Middleware · MVC 앱 · 배포',1,6),(141,'기간','2025.03 ~ 2025.06',2,6),(142,'배포','Linux 홈 서버 + Docker Compose + Nginx',3,6),(143,'Repository','https://github.com/LLagoon3/Custom_Web_Framework',4,6),(144,'서비스','ClassUp 학생앱',0,3),(145,'팀 구성','3명 (FE 2, BE 1)',1,3),(146,'담당','백엔드 전담 · 타이머 API · DB/인덱스 설계 · 검증/명세 자동화',2,3),(147,'기간','2025.08 ~ 2025.10',3,3),(148,'역할','서버 중심 상태 관리, 성능 개선, MongoDB → DynamoDB 운영 전환',4,3);
/*!40000 ALTER TABLE `PROJECT_COMPANY_INFO` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=176 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROJECT_DETAIL`
--

LOCK TABLES `PROJECT_DETAIL` WRITE;
/*!40000 ALTER TABLE `PROJECT_DETAIL` DISABLE KEYS */;
INSERT INTO `PROJECT_DETAIL` VALUES (130,'정식 회원 테이블에 귀속시키기엔 정보 불완전, 폐기하기엔 정식 등록 연계 필요. `tb_temp_user` 임시 엔터티 도입.\n\n- 상담 단계와 등록 단계의 자연스러운 분리\n- 비회원 상태 사용자의 안정적 관리\n- 등록 시 임시 데이터를 정식 프로세스로 승계',0,2,NULL,NULL),(131,'MySQL ngram full-text 는 정보량 많은 문서가 우선 노출되는 한계. RAG 흐름으로 전환.\n\n- 상담 정보 ↔ 수업·교재를 MongoDB Vector Search 로 매칭\n- 검색 결과를 OpenAI 컨텍스트로 전달\n- 키워드 매칭 대신 문맥 기반 추천 생성',1,2,NULL,NULL),(132,'자유 생성 대신 응답 스키마 고정 + 서버 단 검증 단계 도입. 실제 서비스에 안정적으로 사용 가능한 형태로.',2,2,NULL,NULL),(133,'상담 전 수집 정보 구조화로 담당자별 품질 편차 해소. AI 요약·추천 결과를 검수 후 활용하는 운영 흐름 정착.',3,2,NULL,NULL),(148,'EPP / EDR / MDS 가 syslog 로 들어와도 메시지 형식은 전부 다름. 아래 공통 필드로 정규화해 같은 기준으로 필터링·집계 가능하게 함.\n\n- `service` — 어느 솔루션에서 왔는지\n- `risk` — 탐지된 위협 수준\n- `syslog_type` — 장비별 이벤트 유형\n- `parse_status` — 파싱 성공 / 부분 / 실패 상태',0,1,NULL,NULL),(149,'수집 책임과 파싱 책임을 분리해서 가져감.\n\n- `syslog-ng` — 수집 + disk-buffer 기반 안정성\n- `Vector` — VRL 기반 라우팅 / 파싱 / Loki 적재 / 알림 분기\n\n수집 계층은 안정 유지, 파싱 로직은 빠르게 변경 가능한 구조.',1,1,NULL,NULL),(150,'NestJS 기반 별도 MCP 앱 + Loki 질의 도구 구성.\n\n- 헥사고날 아키텍처 (`inbound` / `application` / `outbound`) 분리\n- HTTP `/rpc` + stdio 두 transport 모두 지원\n- Loki 직접 질의 클라이언트를 두고 usecase 단위로 도구 분리',2,1,NULL,NULL),(151,'Grafana 알림 대신 NestJS API 가 직접 Teams Webhook 전송. 메시지에 다음 정보를 포함해 운영자 즉시 인지.\n\n- 사용자 / IP / 발생 시각\n- 악성 파일명 또는 탐지명\n- 서비스 / 위험도',3,1,NULL,NULL),(152,'시나리오 테스트 기준 로그 확인 과정 **86% 단축**. 수작업 5단계 반복 조회 → 자연어 질의 1회 흐름으로 단순화.',4,1,NULL,NULL),(153,'동아리 지원자 정보가 관리자 페이지에서 실수로 삭제되는 문제가 있었습니다. 당시 Django 로그를 추적해 데이터를 복구했고, 이후 같은 문제가 반복돼도 대응할 수 있도록 백업 체계를 만들었습니다.\n\n- Django 로그 기반 삭제 데이터 추적 및 복구\n- `mysqldump` 기반 정기 백업 스크립트 작성\n- `cron`으로 주기 실행\n- 생성된 SQL 백업 파일을 NAS에 저장',0,5,'RECOVERY','운영 중 사고를 복구 가능한 구조로 바꾼 경험'),(154,'학식 정보 조회는 처음에 Selenium 기반 동적 크롤링으로 구현되어 CLI 환경에서 무겁고 느렸습니다. 네트워크 요청을 분석해 실제 데이터 API를 찾고, `requests` 기반 호출로 전환했습니다.\n\n- 기존 Selenium 크롤링: 약 `2300ms`\n- 개선 후 API 직접 호출: 약 `170ms`\n- 약 `93%` 응답 시간 단축\n- CLI 서버 환경에 더 적합한 구조로 변경',1,5,'OPTIMIZATION','Selenium 크롤링을 API 호출로 바꿔 응답 시간을 줄인 경험'),(155,'초기 목표는 동아리 가입 신청을 카카오톡 안에서 처리하는 것이었습니다. 이후 실제 사용자 피드백을 반영해 물품 대여와 학식 조회 기능을 추가했고, 약 18개월간 백엔드 운영과 유지보수를 맡았습니다.\n\n- 가입 신청 기능 구현\n- 물품 대여 기능 추가\n- 학식 조회 기능 추가\n- 약 18개월 운영·유지보수\n- 인수인계 후 현재도 운영 가능한 구조로 정리',2,5,'OPERATION','작은 서비스를 오래 운영하며 기능을 확장한 경험'),(159,'Betting-Duck은 실시간 채팅과 베팅을 함께 다루는 서비스였습니다. 사용자는 방장이 만든 주제에 코인을 걸고, 결과에 따라 보상을 받습니다.\n\n- WebSocket 기반 실시간 채팅·베팅 상태 전달\n- Redis를 활용한 빠른 상태 조회와 업데이트\n- 베팅 진행 중 사용자 경험이 끊기지 않도록 응답 흐름 정리\n\n이 프로젝트에서는 단순 CRUD보다 실시간 상태 변화와 사용자 동기화가 핵심 문제였습니다.',0,4,NULL,NULL),(160,'베팅 종료 시점에는 참여자 코인 정산과 DB 반영이 한꺼번에 발생해 응답 지연이 생겼습니다.\n\n- Redis List + Pub/Sub 기반 메시지 큐 구성\n- List로 메시지 순차 처리 보장\n- Pub/Sub으로 정산 작업 소비 시점 제어\n- ACK Timeout으로 미처리 메시지 감지·재처리\n- DB I/O를 비동기 흐름으로 분리\n\n이를 통해 베팅 종료 API가 정산 작업에 직접 묶이지 않도록 만들고, 응답성을 개선했습니다.',1,4,NULL,NULL),(161,'베팅 서비스는 실시간 처리뿐 아니라 사용자가 쉽게 참여하고, 결과를 보상으로 체감하는 흐름도 중요했습니다.\n\n- 비회원 로그인으로 진입 장벽 완화\n- 동일 IP 기준 닉네임 유지 제약으로 남용 방지\n- 채팅, 베팅, 코인 보상, 마이페이지 꾸미기 흐름 연결\n- Redis 캐시와 원자 연산으로 동시성 문제 완화\n\n서비스 규모는 작았지만, 실시간성과 데이터 정합성, 사용자 경험을 함께 고려한 팀 프로젝트였습니다.',2,4,NULL,NULL),(168,'Node.js http 모듈 대신 net 모듈 기반 TCP stream을 처리했습니다.\n\n- header/body parsing, Content-Length 기반 body 완료 판단\n- 여러 chunk로 나뉘는 요청을 안정적으로 수신하도록 버퍼링 구조 개선',0,6,'HTTP','net 모듈로 HTTP 요청 사이클을 직접 구현한 경험'),(169,'Application / Router / Middleware / Request / Response 구조를 직접 구현했습니다.\n\n- 전역/경로별 미들웨어, 동적 라우팅, 정적 파일 서빙 처리\n- 세션, body parsing, response helper 등 웹 프레임워크 기본 기능 구성',1,6,'FRAMEWORK','Express 유사 구조를 직접 설계한 경험'),(170,'직접 만든 프레임워크를 실제 애플리케이션 코드에서 사용하며 설계를 검증했습니다.\n\n- CRUD, 세션 인증, 파일 업로드/스트리밍을 포함한 게시판 구현\n- 프레임워크 계층과 서비스 로직 계층을 분리',2,6,'APPLICATION','프레임워크 위에 MVC 게시판을 올려 검증한 경험'),(171,'Redis 캐시와 인메모리 캐시 방식을 비교하고, 조회수 증가 흐름을 Redis에 위임했습니다.\n\n- DB 쓰기 부담 완화\n- Lua Script로 증가/조건부 반영 로직을 원자적으로 처리',3,6,'CONCURRENCY','Redis와 Lua Script로 조회수 정합성을 다룬 경험'),(172,'앱 환경에서는 화면 종료나 백그라운드 전환이 자주 발생해, 클라이언트만으로는 학습 시간의 신뢰성을 보장하기 어려웠습니다. 서버가 시작 시각과 활성 상태를 관리하도록 구조를 바꿨습니다.\n\n- 시작 시 `startedAt` 저장\n- 활성 상태는 `tb_user_timer_status`에서 관리\n- 조회 시 `현재 시각 - startedAt`으로 경과 시간 계산\n- 종료 시 `durationSec` 확정 저장',0,3,'ARCHITECTURE','클라이언트 타이머를 서버 중심 상태 관리로 전환'),(173,'동시에 여러 타이머가 켜지면 학습 시간이 중복 누적될 수 있었습니다. 이를 막기 위해 활성 타이머 상태를 별도 테이블로 분리하고, 사용자 기준 유니크 제약을 적용했습니다.\n\n- `tb_user_timer_status.userId` 유니크 제약\n- 중복 시작 방지\n- 활성 타이머 조회 로직 단순화\n- 학습 시간 정합성 확보',1,3,'CONSISTENCY','사용자별 단일 활성 타이머 보장'),(174,'타이머 기록이 쌓이면서 사용자별 공부 기록 조회가 느려졌습니다. 실제 조회 패턴이 `userId` 조건 + `startedAt` 정렬이라는 점을 기준으로 인덱스와 페이지네이션을 다시 설계했습니다.\n\n- `userId + startedAt` 복합 인덱스 추가\n- offset 기반 페이지네이션을 `startedAt` 키셋 페이지네이션으로 전환\n- 주요 쿼리 실행 시간 77% 단축\n- 무한 스크롤 조회 성능 30% 개선',2,3,'PERFORMANCE','기록 조회 성능 개선'),(175,'운영 환경에서는 AWS 연동과 고가용성을 고려해 MongoDB 기반 구조를 DynamoDB로 전환했습니다. 또한 UTC/KST 차이로 날짜가 어긋나는 문제를 막기 위해 시간 변환을 공통 처리했습니다.\n\n- MongoDB 기반 개발 구조에서 DynamoDB 운영 구조로 전환\n- Mongoose Hook 기반 UTC/KST 변환 적용\n- 날짜 단위 학습 기록 정합성 확보\n- Joi + Swagger로 요청 검증과 API 명세 자동화',3,3,'OPERATION','운영 환경 전환과 시간대 정합성 처리');
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
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROJECT_STAT`
--

LOCK TABLES `PROJECT_STAT` WRITE;
/*!40000 ALTER TABLE `PROJECT_STAT` DISABLE KEYS */;
INSERT INTO `PROJECT_STAT` VALUES (28,'Log lookup','-86%','10–15분 → 1–2분',0,1,'2026-05-26 23:28:31.183291'),(29,'Maintenance','18mo','운영·유지보수',0,5,'2026-05-27 11:39:05.153604'),(30,'Crawling Cut','93%','2300ms → 170ms',1,5,'2026-05-27 11:39:05.153604'),(31,'Recovery Ready','Backup','로그 복구 후 정기 백업 도입',2,5,'2026-05-27 11:39:05.153604'),(36,'API Performance','10x','Redis 큐 적용 후 응답성 개선',0,4,'2026-05-27 12:21:49.749610'),(41,'OWNERSHIP','100%','설계 · 구현 · 배포 전 과정',0,6,'2026-05-27 13:11:28.705923'),(42,'Query Cut','77%','MongoDB `userId + startedAt` 복합 인덱스',0,3,'2026-05-27 13:21:26.108155'),(43,'Pagination Gain','30%','`startedAt` 기준 키셋 페이지네이션',1,3,'2026-05-27 13:21:26.108155'),(44,'SQL Tuning','75%','MySQL EXPLAIN 기반 쿼리 튜닝',2,3,'2026-05-27 13:21:26.108155');
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
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROJECT_QUOTE`
--

LOCK TABLES `PROJECT_QUOTE` WRITE;
/*!40000 ALTER TABLE `PROJECT_QUOTE` DISABLE KEYS */;
INSERT INTO `PROJECT_QUOTE` VALUES (18,'RAG 는 검색 결과를 LLM 에 넘기는 작업이 아니라, 어떤 데이터를 신뢰할지 정하는 일이다.','프로젝트 회고',2,'2026-05-26 23:06:27.904264'),(19,'화면이 꺼져도 시간은 흐르기 때문에, 신뢰할 수 있는 시계는 서버에 두었습니다.','프로젝트 회고',3,'2026-05-26 23:07:40.410168'),(23,'로그를 모으는 것보다 어려운 건, 다른 형태의 데이터를 같은 기준으로 보게 만드는 일이었다.','프로젝트 회고',1,'2026-05-26 23:28:31.181313'),(24,'복구에서 끝내지 않고, 다시 복구할 수 있는 구조를 남겼습니다.','프로젝트 회고',5,'2026-05-27 11:39:05.154140'),(26,'실시간 서비스에서는 기능보다 먼저, 상태 변화가 안전하게 흘러가는 구조가 필요했습니다.','프로젝트 회고',4,'2026-05-27 12:21:49.745236'),(28,'프레임워크를 직접 만들며, 추상화가 어디서 시작되고 어디서 깨지는지 배웠습니다.','프로젝트 회고',6,'2026-05-27 12:31:39.288885');
/*!40000 ALTER TABLE `PROJECT_QUOTE` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PROJECT_TECHNOLOGY`
--

DROP TABLE IF EXISTS `PROJECT_TECHNOLOGY`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PROJECT_TECHNOLOGY` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `project_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_2c729edeef17e3348f5a9b82e8d` (`project_id`),
  CONSTRAINT `FK_2c729edeef17e3348f5a9b82e8d` FOREIGN KEY (`project_id`) REFERENCES `PROJECT` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROJECT_TECHNOLOGY`
--

LOCK TABLES `PROJECT_TECHNOLOGY` WRITE;
/*!40000 ALTER TABLE `PROJECT_TECHNOLOGY` DISABLE KEYS */;
INSERT INTO `PROJECT_TECHNOLOGY` VALUES (25,'Tools & Technologies',0,2),(28,'Tools & Technologies',0,5),(30,'Tools & Technologies',0,1),(31,'Tools & Technologies',0,4),(34,'Tools & Technologies',0,6),(35,'Tools & Technologies',0,3);
/*!40000 ALTER TABLE `PROJECT_TECHNOLOGY` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PROJECT_TECHNOLOGY_ITEM`
--

DROP TABLE IF EXISTS `PROJECT_TECHNOLOGY_ITEM`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PROJECT_TECHNOLOGY_ITEM` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `technology_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_f3a410a10415855a4705000b70f` (`technology_id`),
  CONSTRAINT `FK_f3a410a10415855a4705000b70f` FOREIGN KEY (`technology_id`) REFERENCES `PROJECT_TECHNOLOGY` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=309 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROJECT_TECHNOLOGY_ITEM`
--

LOCK TABLES `PROJECT_TECHNOLOGY_ITEM` WRITE;
/*!40000 ALTER TABLE `PROJECT_TECHNOLOGY_ITEM` DISABLE KEYS */;
INSERT INTO `PROJECT_TECHNOLOGY_ITEM` VALUES (196,'Express.js',0,25),(197,'TypeScript',1,25),(198,'MySQL',2,25),(199,'Sequelize',3,25),(200,'MongoDB',4,25),(201,'MongoDB Vector Search',5,25),(202,'OpenAI API',6,25),(203,'Swagger',7,25),(219,'Python',0,28),(220,'Django',1,28),(221,'MySQL',2,28),(222,'Kakao Chatbot',3,28),(223,'cron',4,28),(224,'mysqldump',5,28),(225,'requests',6,28),(237,'Node.js',0,30),(238,'TypeScript',1,30),(239,'NestJS',2,30),(240,'syslog-ng',3,30),(241,'Vector',4,30),(242,'Loki',5,30),(243,'Grafana',6,30),(244,'Docker Compose',7,30),(245,'Teams Webhook',8,30),(246,'MCP',9,30),(247,'JSON-RPC',10,30),(257,'TypeScript',0,31),(258,'NestJS',1,31),(259,'Socket.IO',2,31),(260,'PostgreSQL',3,31),(261,'Redis',4,31),(262,'Redis List',5,31),(263,'Pub/Sub',6,31),(264,'HINCRBY',7,31),(265,'Message Queue',8,31),(288,'TypeScript',0,34),(289,'Node.js net',1,34),(290,'HTTP',2,34),(291,'Router',3,34),(292,'Middleware',4,34),(293,'Redis',5,34),(294,'Lua Script',6,34),(295,'MySQL',7,34),(296,'Docker Compose',8,34),(297,'Nginx',9,34),(298,'Linux',10,34),(299,'Express.js',0,35),(300,'TypeScript',1,35),(301,'MySQL',2,35),(302,'Sequelize',3,35),(303,'MongoDB',4,35),(304,'DynamoDB',5,35),(305,'Joi',6,35),(306,'Swagger',7,35),(307,'Compound Index',8,35),(308,'Keyset Pagination',9,35);
/*!40000 ALTER TABLE `PROJECT_TECHNOLOGY_ITEM` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-27 13:54:46
