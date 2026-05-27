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
-- Table structure for table `ABOUT_BIO`
--

DROP TABLE IF EXISTS `ABOUT_BIO`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ABOUT_BIO` (
  `id` int NOT NULL AUTO_INCREMENT,
  `paragraph` text NOT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `profile_id` tinyint NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_aaf47f3a22ae7945ad227e39f5e` (`profile_id`),
  CONSTRAINT `FK_aaf47f3a22ae7945ad227e39f5e` FOREIGN KEY (`profile_id`) REFERENCES `ABOUT_PROFILE` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ABOUT_BIO`
--

LOCK TABLES `ABOUT_BIO` WRITE;
/*!40000 ALTER TABLE `ABOUT_BIO` DISABLE KEYS */;
INSERT INTO `ABOUT_BIO` VALUES (43,'## 1. 한 줄 소개\n\n서비스의 동작 원리와 운영 구조를 함께 이해하며, 성능·안정성·운영 효율을 개선하는 백엔드 개발자입니다.',0,1,'2026-05-26 23:42:49.740465'),(44,'## 2. 짧은 소개\n\n저는 단순히 기능을 구현하는 데서 멈추지 않고, 그 기능이 실제 환경에서 어떻게 동작하는지까지 함께 보는 개발자입니다.  \n개발을 하면서 가장 흥미를 느끼는 순간도 새로운 기능을 빠르게 붙였을 때보다, 문제의 원인을 파악하고 더 나은 구조로 바꾸었을 때였습니다.\n\n그래서 저는 스스로를 단순한 구현형 개발자보다, 운영 과정의 문제를 줄이고 서비스 품질을 높이는 **운영 개선형 백엔드 개발자**에 더 가깝다고 생각합니다.',1,1,'2026-05-26 23:42:49.743152'),(45,'## 3. 제가 중요하게 생각하는 개발 방식\n\n저는 백엔드 개발에서 중요한 것은 기능 추가 자체보다, 서비스가 실제 환경에서 안정적으로 동작하고 운영이 더 쉬워지도록 만드는 것이라고 생각합니다.\n\n클래스업 학생앱 타이머 기능에서는 앱이 종료되거나 백그라운드로 전환되어도 학습 시간이 정확히 누적되도록 서버 중심 상태 관리 구조를 설계했습니다. 이후 MongoDB 복합 인덱스와 키셋 페이지네이션을 적용해 조회 성능도 함께 개선했습니다.\n\nBetting-Duck 프로젝트에서는 베팅 종료 API의 병목을 분석하고, Redis 기반 큐와 비동기 처리 방식을 적용해 응답 시간을 **1441ms에서 333ms로 단축**했습니다.\n\n통합 로그 시스템 프로젝트에서는 여러 보안 솔루션의 로그를 공통 스키마로 정규화하고, `syslog-ng`, `Vector`, `Loki`, `Grafana`, `Teams 알림`, `MCP 자연어 조회`를 연결한 통합 파이프라인을 직접 구성했습니다. 이를 통해 운영자가 더 빠르게 문제를 확인하고 대응할 수 있는 흐름을 만들었습니다.',2,1,'2026-05-26 23:42:49.744777'),(46,'## 4. 저를 가장 잘 보여주는 강점\n\n- **원인을 끝까지 파고드는 습관**  \n  문제가 생기면 겉으로 드러난 증상보다, 왜 이런 문제가 발생했는지부터 확인합니다.\n\n- **운영을 고려한 백엔드 시야**  \n  API 개발에만 머물지 않고 로그, 성능, 데이터 흐름, 장애 대응, 운영 효율까지 함께 봅니다.\n\n- **실시간성과 성능 최적화 경험**  \n  Redis, 캐시, 큐, 인덱스, 페이지네이션 등 백엔드에서 자주 마주치는 성능 문제를 실제 프로젝트에서 다뤄봤습니다.\n\n- **원리를 이해하려는 태도**  \n  커스텀 웹 프레임워크 프로젝트에서 Node.js `net` 모듈 위에 HTTP 요청 파싱, Router, Middleware 구조를 직접 구현하며 내부 동작 원리까지 이해하려고 노력해왔습니다.',3,1,'2026-05-26 23:42:49.746297'),(47,'## 5. 앞으로의 방향\n\n앞으로도 저는 단순히 기능을 만드는 개발자보다, 서비스가 오래 운영될수록 더 가치가 커지는 구조를 만드는 백엔드 개발자로 성장하고 싶습니다.\n\n특히 실시간 시스템, 성능 최적화, 로그와 관측성, 운영 자동화, 그리고 AI/LLM을 실제 서비스와 운영 흐름에 연결하는 문제를 계속 깊게 다루고 싶습니다.',4,1,'2026-05-26 23:42:49.747795');
/*!40000 ALTER TABLE `ABOUT_BIO` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-27  8:15:49
