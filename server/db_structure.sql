SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `masjidtimes`
--

-- --------------------------------------------------------

--
-- Table structure for table `mosque`
--

CREATE TABLE `mosque` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prayertimes_id` int(11) NOT NULL,
  `lat` double NOT NULL,
  `long` double NOT NULL,
  `dst-start` datetime DEFAULT NULL,
  `dst-end` datetime DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `location` varchar(100) NOT NULL,
  `contact` varchar(60) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL,
  `description` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;

-- --------------------------------------------------------

--
-- Table structure for table `prayertimes`
--

CREATE TABLE `prayertimes` (
  `id` int(11) NOT NULL,
  `month` smallint(6) NOT NULL,
  `day` smallint(6) NOT NULL,
  `fajr` varchar(5) NOT NULL,
  `shuruq` varchar(5) NOT NULL,
  `duhr` varchar(5) NOT NULL,
  `asr` varchar(5) NOT NULL,
  `asr2` varchar(5) DEFAULT NULL,
  `maghrib` varchar(5) NOT NULL,
  `isha` varchar(5) NOT NULL,
  PRIMARY KEY (`id`,`month`,`day`),
  KEY `mosque_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
