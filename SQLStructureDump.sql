-- MariaDB dump 10.19  Distrib 10.10.2-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: melodydb
-- ------------------------------------------------------
-- Server version	10.10.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `account` (
  `Id` int(10) NOT NULL AUTO_INCREMENT,
  `StaffId` int(10) NOT NULL,
  `UserName` varchar(100) NOT NULL,
  `Password` varchar(100) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `UserName_UNIQUE` (`UserName`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookedservices`
--

DROP TABLE IF EXISTS `bookedservices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bookedservices` (
  `Id` bigint(30) NOT NULL AUTO_INCREMENT,
  `BookingId` int(10) NOT NULL,
  `ServiceId` int(10) NOT NULL,
  `Time` int(2) NOT NULL,
  `Done` varchar(3) NOT NULL DEFAULT 'NO',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookedservices`
--

LOCK TABLES `bookedservices` WRITE;
/*!40000 ALTER TABLE `bookedservices` DISABLE KEYS */;
INSERT INTO `bookedservices` VALUES
(1,1,9,0,'NO'),
(2,1,5,2,'NO'),
(3,1,5,3,'NO'),
(4,1,21,1,'NO'),
(5,1,9,4,'NO'),
(6,2,5,9,'NO'),
(7,2,5,7,'NO'),
(8,2,5,6,'NO'),
(9,3,5,9,'NO'),
(10,3,5,7,'NO'),
(11,3,5,6,'NO'),
(12,3,9,0,'NO'),
(13,3,9,2,'NO'),
(14,3,21,3,'NO'),
(15,4,5,2,'NO'),
(16,4,5,3,'NO'),
(17,5,9,0,'NO'),
(18,5,5,1,'NO'),
(19,5,9,2,'NO'),
(20,6,16,1,'NO'),
(21,7,9,1,'NO'),
(22,8,7,0,'NO'),
(23,9,5,3,'NO'),
(24,10,18,4,'NO'),
(25,11,13,4,'NO'),
(26,12,5,4,'NO'),
(27,12,16,5,'NO');
/*!40000 ALTER TABLE `bookedservices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bookings` (
  `Id` bigint(30) NOT NULL AUTO_INCREMENT,
  `Customer` varchar(100) NOT NULL,
  `BookingDate` date NOT NULL,
  `CheckedIn` varchar(3) NOT NULL DEFAULT 'NO',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES
(1,'test@test.com','2022-12-14','NO'),
(2,'test2@test.com','2022-12-14','NO'),
(3,'test2@test.com','2022-12-14','NO'),
(4,'test@test.au','2022-12-14','NO'),
(5,'efE@gegseg.cwa','2022-12-14','NO'),
(6,'wdaw@awda.wda','2022-12-14','NO'),
(7,'efase@efawf.co','2022-12-14','NO'),
(8,'test@test.com','2022-12-14','NO'),
(9,'test@test.test','2022-12-14','NO'),
(10,'test@test.com','2022-12-14','NO'),
(11,'test2@test.com','2022-12-14','NO'),
(12,'test2@test2.co','2022-12-14','NO');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role` (
  `Id` int(10) NOT NULL AUTO_INCREMENT,
  `RoleName` varchar(10) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `services` (
  `Id` int(10) NOT NULL AUTO_INCREMENT,
  `ServiceTypeId` int(10) NOT NULL,
  `ServiceName` varchar(100) NOT NULL,
  `ServicePrice` varchar(20) NOT NULL,
  `ServiceDescription` varchar(5000) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES
(5,1,'Buff shape & gel colours','30',''),
(6,1,'Manicure & gel colours','35',''),
(7,1,'Pedicure & gel colours','40',''),
(8,1,'Refill & gel colours','45',''),
(9,2,'Full set nature tip','45',''),
(10,2,'Full set French tip','45',''),
(11,2,'Full set acrylic and gel colours','50',''),
(12,2,'Overlay','45',''),
(13,2,'Full set Ombre','60',''),
(14,2,'Refill Ombre','50',''),
(15,2,'Full set toes nails','55',''),
(16,3,'Pedicure','35',''),
(17,3,'Manicure','25',''),
(18,3,'Manicure & Pedicure','60',''),
(19,3,'Buff Shape & Polish','15',''),
(20,3,'Nail arts / Foil','5',''),
(21,4,'Eye brow','10',''),
(22,4,'Lip or chin','5',''),
(23,4,'Full Leg','45',''),
(24,4,'Half Leg','25',''),
(25,4,'Full arms','40',''),
(26,4,'Half arms','20',''),
(27,4,'Under arms','15',''),
(28,4,'Bikini','30',''),
(29,4,'Chest','30',''),
(30,4,'Stomach','30',''),
(31,4,'Back','40',''),
(32,5,'Eyes brow tinting','15',''),
(33,5,'Eyeslash tinting','20',''),
(34,5,'Eyeslash perm','25','');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `servicetypes`
--

DROP TABLE IF EXISTS `servicetypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `servicetypes` (
  `Id` int(10) NOT NULL AUTO_INCREMENT,
  `ServiceTypeName` varchar(100) DEFAULT NULL,
  `ServiceTypeDescription` varchar(5000) DEFAULT NULL,
  `ServiceTypeImage` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicetypes`
--

LOCK TABLES `servicetypes` WRITE;
/*!40000 ALTER TABLE `servicetypes` DISABLE KEYS */;
INSERT INTO `servicetypes` VALUES
(1,'Gel Colours','',NULL),
(2,'Acrylic Nails','',NULL),
(3,'Nails Care','',NULL),
(4,'Waxing','',NULL),
(5,'Other Services','',NULL);
/*!40000 ALTER TABLE `servicetypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `staff` (
  `Id` int(10) NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(100) NOT NULL,
  `LastName` varchar(100) DEFAULT NULL,
  `RoleId` int(10) NOT NULL,
  `Salary` varchar(10) NOT NULL,
  `Active` varchar(3) NOT NULL DEFAULT 'YES',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-18  7:27:12
