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
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROJECT_STAT`
--

LOCK TABLES `PROJECT_STAT` WRITE;
/*!40000 ALTER TABLE `PROJECT_STAT` DISABLE KEYS */;
INSERT INTO `PROJECT_STAT` VALUES (24,'Query latency','-77%','복합 인덱스 + 키셋 페이지네이션',0,3,'2026-05-26 23:07:40.411844'),(28,'Log lookup','-86%','10–15분 → 1–2분',0,1,'2026-05-26 23:28:31.183291'),(29,'Maintenance','18mo','운영·유지보수',0,5,'2026-05-27 11:39:05.153604'),(30,'Crawling Cut','93%','2300ms → 170ms',1,5,'2026-05-27 11:39:05.153604'),(31,'Recovery Ready','Backup','로그 복구 후 정기 백업 도입',2,5,'2026-05-27 11:39:05.153604'),(32,'API Performance','10x','Redis 큐 적용 후 응답성 개선',0,4,'2026-05-27 12:16:42.644212'),(33,'Realtime Flow','WebSocket','채팅·베팅 상태 실시간 동기화',1,4,'2026-05-27 12:16:42.644212'),(34,'Concurrency','Redis','HINCRBY 기반 원자적 코인 처리',2,4,'2026-05-27 12:16:42.644212');
/*!40000 ALTER TABLE `PROJECT_STAT` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-27 12:19:55
