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
-- WHERE:  id=4

LOCK TABLES `PROJECT` WRITE;
/*!40000 ALTER TABLE `PROJECT` DISABLE KEYS */;
INSERT INTO `PROJECT` VALUES (4,'betting-duck','베팅덕 (실시간 베팅 서비스)','Realtime Backend','/uploads/513bd7b9-a12a-4a49-baa1-ad1d1a8148c0.jpg','2024.10 – 2025.02','NestJS / Socket.IO / Redis / PostgreSQL','About Project','Objective','실시간 베팅·채팅 서비스. Redis 큐로 베팅 종료와 코인 정산 응답성을 개선했습니다.','Challenge','Share This Project','2026-04-20 17:08:10.682530','Redis 큐와 캐시 전략으로 실시간 베팅의 응답성과 정합성을 개선한 백엔드 프로젝트','Realtime','아키텍처 기획 · 백엔드 개발',NULL);
/*!40000 ALTER TABLE `PROJECT` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-27 14:33:44
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
) ENGINE=InnoDB AUTO_INCREMENT=206 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROJECT_DETAIL`
--
-- WHERE:  project_id=4

LOCK TABLES `PROJECT_DETAIL` WRITE;
/*!40000 ALTER TABLE `PROJECT_DETAIL` DISABLE KEYS */;
INSERT INTO `PROJECT_DETAIL` VALUES (184,'Betting-Duck은 실시간 채팅과 베팅을 함께 다루는 서비스였습니다. 사용자는 방장이 만든 주제에 코인을 걸고, 결과에 따라 보상을 받습니다.\n\n- WebSocket 기반 실시간 채팅·베팅 상태 전달\n- Redis를 활용한 빠른 상태 조회와 업데이트\n- 베팅 진행 중 사용자 경험이 끊기지 않도록 응답 흐름 정리\n\n이 프로젝트에서는 단순 CRUD보다 실시간 상태 변화와 사용자 동기화가 핵심 문제였습니다.',0,4,'ARCHITECTURE','실시간 채팅 + 베팅 + 코인 경제 통합 흐름'),(185,'베팅 종료 시점에는 참여자 코인 정산과 DB 반영이 한꺼번에 발생해 응답 지연이 생겼습니다.\n\n- Redis List + Pub/Sub 기반 메시지 큐 구성\n- List로 메시지 순차 처리 보장\n- Pub/Sub으로 정산 작업 소비 시점 제어\n- ACK Timeout으로 미처리 메시지 감지·재처리\n- DB I/O를 비동기 흐름으로 분리\n\n이를 통해 베팅 종료 API가 정산 작업에 직접 묶이지 않도록 만들고, 응답성을 개선했습니다.',1,4,'PERFORMANCE','Redis 큐로 베팅 종료 응답 지연 해소'),(186,'베팅 서비스는 실시간 처리뿐 아니라 사용자가 쉽게 참여하고, 결과를 보상으로 체감하는 흐름도 중요했습니다.\n\n- 비회원 로그인으로 진입 장벽 완화\n- 동일 IP 기준 닉네임 유지 제약으로 남용 방지\n- 채팅, 베팅, 코인 보상, 마이페이지 꾸미기 흐름 연결\n- Redis 캐시와 원자 연산으로 동시성 문제 완화\n\n서비스 규모는 작았지만, 실시간성과 데이터 정합성, 사용자 경험을 함께 고려한 팀 프로젝트였습니다.',2,4,'DECISION','비회원 진입 흐름과 남용 방지 설계');
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
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROJECT_STAT`
--
-- WHERE:  project_id=4

LOCK TABLES `PROJECT_STAT` WRITE;
/*!40000 ALTER TABLE `PROJECT_STAT` DISABLE KEYS */;
INSERT INTO `PROJECT_STAT` VALUES (48,'API Performance','10x','Redis 큐 적용 후 응답성 개선',0,4,'2026-05-27 14:17:30.929191');
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
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROJECT_QUOTE`
--
-- WHERE:  project_id=4

LOCK TABLES `PROJECT_QUOTE` WRITE;
/*!40000 ALTER TABLE `PROJECT_QUOTE` DISABLE KEYS */;
INSERT INTO `PROJECT_QUOTE` VALUES (34,'실시간 서비스에서는 기능보다 먼저, 상태 변화가 안전하게 흘러가는 구조가 필요했습니다.','프로젝트 회고',4,'2026-05-27 14:17:30.926902');
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

-- Dump completed on 2026-05-27 14:33:44
