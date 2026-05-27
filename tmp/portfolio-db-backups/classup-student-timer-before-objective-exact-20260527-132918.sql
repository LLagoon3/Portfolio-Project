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
-- WHERE:  id=3

LOCK TABLES `PROJECT` WRITE;
/*!40000 ALTER TABLE `PROJECT` DISABLE KEYS */;
INSERT INTO `PROJECT` VALUES (3,'classup-student-timer','클래스업 학생앱 - 타이머 서비스','Backend / Performance','/uploads/0f41ae34-04f1-4fb1-ae1e-f28526530c9c.jpg','2025.08 – 2025.10 · 팀 프로젝트 / 백엔드 전담','Express / TypeScript / MongoDB / DynamoDB / Joi / Swagger','About Project','Objective','앱 종료·백그라운드 전환에도 학습 시간이 안정적으로 누적되도록 서버 중심 타이머 구조를 설계한 프로젝트입니다. 서버가 시작 시각과 활성 상태를 관리하고, 기록 누적에 따른 조회 성능 문제까지 인덱스와 키셋 페이지네이션으로 함께 개선했습니다.','Challenge','Share This Project','2026-04-20 17:08:10.635486',NULL,'Timer','백엔드 전반 (타이머 API · DB 설계 · Mongo↔DynamoDB 마이그레이션)',NULL);
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

-- Dump completed on 2026-05-27 13:29:18
