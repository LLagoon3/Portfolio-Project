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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ABOUT_JOURNEY`
--

LOCK TABLES `ABOUT_JOURNEY` WRITE;
/*!40000 ALTER TABLE `ABOUT_JOURNEY` DISABLE KEYS */;
INSERT INTO `ABOUT_JOURNEY` VALUES (9,'2024.01 - 2024.05','CaTs ChatBot','Backend Lead / Production Maintenance','카카오 챗봇 기반 동아리 가입·물품 대여·학식 정보 서비스를 Django로 구현했습니다. DB 삭제 사고 이후 로그 기반 복구와 정기 백업 체계를 만들고, 이후 약 18개월간 운영·유지보수를 이어갔습니다.',0,1,'2026-05-27 07:52:32.987050'),(10,'2024.06 - 2025.03','네이버 부스트캠프 & Betting-Duck','Realtime Backend','부스트캠프에서 Node.js 서버 구조를 깊게 학습했고, Betting-Duck에서는 WebSocket, Redis, 메시지 큐, 캐시 전략을 활용해 실시간 베팅과 채팅 흐름을 구현했습니다.',1,1,'2026-05-27 07:52:32.987050'),(11,'2025.03 - 2025.06','커스텀 웹 프레임워크','Personal Project','Node.js net 모듈 위에서 HTTP 요청 파싱, Router, Middleware, 정적 파일 서빙, 세션, 파일 스트리밍을 직접 구현하며 웹 프레임워크 내부 동작을 학습했습니다.',2,1,'2026-05-27 07:52:32.987050'),(12,'2025.08 - 2025.10','ClassUp 학생앱 타이머','Backend Intern','앱 종료·백그라운드 전환에도 학습 시간이 정확히 누적되도록 서버 중심 타이머 상태 관리 구조를 설계했고, 복합 인덱스와 키셋 페이지네이션으로 조회 성능을 개선했습니다.',3,1,'2026-05-27 07:52:32.987050'),(13,'2025.10 - 2025.12','ClassUp 사전 상담 기능','AI Application Backend','상담 전 학생·학부모 정보를 구조화하고 MongoDB Vector Search와 OpenAI API를 연결해 RAG 기반 수업·교재 추천과 상담 요약 기능을 구현했습니다.',4,1,'2026-05-27 07:52:32.987050'),(14,'2026.01 - 2026.03','통합 로그 시스템','Backend / Data Pipeline','AhnLab EPP·EDR·MDS 로그를 syslog-ng, Vector, Loki, Grafana, Teams 알림, MCP 자연어 조회로 연결해 운영자가 더 빠르게 로그를 찾고 대응하는 흐름을 만들었습니다.',5,1,'2026-05-27 07:52:32.987050');
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

-- Dump completed on 2026-05-27  7:54:29
