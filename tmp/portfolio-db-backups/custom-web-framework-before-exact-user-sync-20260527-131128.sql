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
-- WHERE:  id=6

LOCK TABLES `PROJECT` WRITE;
/*!40000 ALTER TABLE `PROJECT` DISABLE KEYS */;
INSERT INTO `PROJECT` VALUES (6,'custom-web-framework','커스텀 웹 프레임워크','Low-level Backend','/uploads/d5778a9a-ab8c-4230-94be-74e5f6d41f35.jpg','2025.03 – 2025.06 · 개인 프로젝트 / 기여도 100%','Node.js net / HTTP / Router / Middleware / Redis','About Project','Objective','Node.js net 모듈로 HTTP 요청 처리와 프레임워크 구조를 직접 구현한 프로젝트입니다.','Challenge','Share This Project','2026-04-20 17:08:10.757621','Node.js net 모듈 위에서 HTTP 요청 사이클과 Express 유사 프레임워크 구조를 직접 구현한 프로젝트','Framework','테스트','테스트');
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

-- Dump completed on 2026-05-27 13:11:28
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
) ENGINE=InnoDB AUTO_INCREMENT=168 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROJECT_DETAIL`
--
-- WHERE:  project_id=6

LOCK TABLES `PROJECT_DETAIL` WRITE;
/*!40000 ALTER TABLE `PROJECT_DETAIL` DISABLE KEYS */;
INSERT INTO `PROJECT_DETAIL` VALUES (165,'Node.js http 모듈 대신 net 모듈을 사용해 HTTP/1.1 요청을 직접 파싱했습니다. 추상화된 프레임워크 밖에서 요청이 들어오고, 바디가 모이고, 응답이 만들어지는 흐름을 직접 다뤘습니다.\n\n- 헤더 / 바디 파싱 직접 구현\n- Content-Length 기반 body 수신 완료 판단\n- chunk 단위 요청 수신 처리\n- Request / Response 객체 설계',0,6,NULL,NULL),(166,'단순 토이 서버가 아니라 실제 애플리케이션을 올릴 수 있는 구조를 목표로 Application, Router, Middleware 계층을 분리했습니다. 그 위에 MVC 게시판을 구현해 프레임워크 계층과 서비스 로직 계층을 나누는 방식을 검증했습니다.\n\n- Application / Router / Middleware 구조 설계\n- 전역 / 경로별 미들웨어 처리\n- 동적 라우팅 지원\n- MVC 게시판 앱으로 구조 검증',1,6,NULL,NULL),(167,'Redis 캐시가 항상 빠른 답은 아니라는 점을 실제 측정으로 확인했습니다. API JSON 응답과 정적 파일 응답을 분리해 보고, 정적 파일은 인메모리 캐시가 더 적합하다고 판단해 직접 MemoryCache를 적용했습니다.\n\n- Redis 캐시 적용 후 병목 재분석\n- JSON.stringify / 직렬화 비용 확인\n- 정적 파일 캐시에 MemoryCache 적용\n- 정적 파일 응답 64ms → 30ms 개선',2,6,NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROJECT_STAT`
--
-- WHERE:  project_id=6

LOCK TABLES `PROJECT_STAT` WRITE;
/*!40000 ALTER TABLE `PROJECT_STAT` DISABLE KEYS */;
INSERT INTO `PROJECT_STAT` VALUES (39,'Static Response Cut','53%','64ms → 30ms',0,6,'2026-05-27 12:31:39.292789'),(40,'Contribution','100%','개인 프로젝트',1,6,'2026-05-27 12:31:39.295333');
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
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROJECT_QUOTE`
--
-- WHERE:  project_id=6

LOCK TABLES `PROJECT_QUOTE` WRITE;
/*!40000 ALTER TABLE `PROJECT_QUOTE` DISABLE KEYS */;
INSERT INTO `PROJECT_QUOTE` VALUES (28,'프레임워크를 직접 만들며, 추상화가 어디서 시작되고 어디서 깨지는지 배웠습니다.','프로젝트 회고',6,'2026-05-27 12:31:39.288885');
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
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROJECT_TECHNOLOGY`
--
-- WHERE:  project_id=6

LOCK TABLES `PROJECT_TECHNOLOGY` WRITE;
/*!40000 ALTER TABLE `PROJECT_TECHNOLOGY` DISABLE KEYS */;
INSERT INTO `PROJECT_TECHNOLOGY` VALUES (33,'Tools & Technologies',0,6);
/*!40000 ALTER TABLE `PROJECT_TECHNOLOGY` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=139 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROJECT_COMPANY_INFO`
--
-- WHERE:  project_id=6

LOCK TABLES `PROJECT_COMPANY_INFO` WRITE;
/*!40000 ALTER TABLE `PROJECT_COMPANY_INFO` DISABLE KEYS */;
INSERT INTO `PROJECT_COMPANY_INFO` VALUES (134,'프로젝트 성격','개인 프로젝트 (기여도 100%)',0,6),(135,'담당','프레임워크 코어 · MVC 애플리케이션 · 배포 전반',1,6),(136,'기간','2025.03 ~ 2025.06',2,6),(137,'배포','Linux 홈 서버 + Docker Compose + Nginx',3,6),(138,'Repository','https://github.com/LLagoon3/Custom_Web_Framework',4,6);
/*!40000 ALTER TABLE `PROJECT_COMPANY_INFO` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-27 13:11:28
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
) ENGINE=InnoDB AUTO_INCREMENT=288 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROJECT_TECHNOLOGY_ITEM`
--
-- WHERE:  technology_id IN (33)

LOCK TABLES `PROJECT_TECHNOLOGY_ITEM` WRITE;
/*!40000 ALTER TABLE `PROJECT_TECHNOLOGY_ITEM` DISABLE KEYS */;
INSERT INTO `PROJECT_TECHNOLOGY_ITEM` VALUES (277,'TypeScript',0,33),(278,'Node.js net',1,33),(279,'HTTP/1.1 Parsing',2,33),(280,'Router',3,33),(281,'Middleware',4,33),(282,'Session',5,33),(283,'Static Serving',6,33),(284,'MySQL',7,33),(285,'Redis',8,33),(286,'Docker Compose',9,33),(287,'Nginx',10,33);
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

-- Dump completed on 2026-05-27 13:11:28
