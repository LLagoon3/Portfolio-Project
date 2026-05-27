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
-- Table structure for table `ABOUT_JOURNEY`
--

DROP TABLE IF EXISTS `ABOUT_JOURNEY`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ABOUT_JOURNEY` (
  `id` int NOT NULL AUTO_INCREMENT,
  `year` varchar(100) NOT NULL,
  `title` varchar(200) NOT NULL,
  `role` varchar(200) DEFAULT NULL,
  `body` text NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `profile_id` tinyint NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_about_journey_profile` (`profile_id`),
  CONSTRAINT `FK_about_journey_profile` FOREIGN KEY (`profile_id`) REFERENCES `ABOUT_PROFILE` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ABOUT_JOURNEY`
--

LOCK TABLES `ABOUT_JOURNEY` WRITE;
/*!40000 ALTER TABLE `ABOUT_JOURNEY` DISABLE KEYS */;
INSERT INTO `ABOUT_JOURNEY` VALUES (3,'2019.03 - 2025.02','충북대학교 컴퓨터공학과','Computer Science','컴퓨터공학 전공으로 백엔드, 데이터베이스, 네트워크, 소프트웨어 구조의 기반을 다졌고, 졸업 평점 3.76 / 4.5로 학업을 마쳤습니다.',0,1,'2026-05-27 07:01:14.855022'),(4,'2023.08 - 2025.02','학술 동아리 CaTs','Backend / Server Lead','Django 기반 챗봇 서비스와 동아리 서버를 운영하며 가입 신청, 물품 대여, 학식 정보 기능을 만들고 장애 복구 이후 백업 체계를 정비했습니다.',1,1,'2026-05-27 07:01:14.855022'),(5,'2023.09 - 2024.02','DAILAB 학부연구생','Undergraduate Researcher','Transformer, RLHF, TRLX 기반 파인튜닝 흐름을 학습하고 AI 소설 생성 연구를 진행하며 LLM을 제품 기능으로 연결하는 감각을 쌓았습니다.',2,1,'2026-05-27 07:01:14.855022'),(6,'2024.06 - 2025.03','네이버 부스트캠프 웹·모바일 9기','Backend / Team Project','Node.js 비동기 I/O와 웹 서버 구조를 깊게 학습했고, Betting-Duck에서 Redis, WebSocket, 메시지 큐 기반 실시간 베팅 서비스를 구현했습니다.',3,1,'2026-05-27 07:01:14.855022'),(7,'2025.08 - 2025.12','SampLab / ClassUp','Backend Intern','ClassUp 학생앱 타이머와 사전 상담 기능을 담당하며 서버 중심 상태 관리, 인덱스 최적화, RAG 추천, API 명세화, 데이터 마이그레이션을 경험했습니다.',4,1,'2026-05-27 07:01:14.855022'),(8,'2026.01 - 2026.03','통합 로그 시스템','Backend / Data Pipeline','AhnLab EPP·EDR·MDS 로그를 syslog-ng, Vector, Loki, Grafana, Teams 알림, MCP 자연어 조회로 연결해 운영 대응 흐름을 개선했습니다.',5,1,'2026-05-27 07:01:14.855022');
/*!40000 ALTER TABLE `ABOUT_JOURNEY` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-27  7:52:20
