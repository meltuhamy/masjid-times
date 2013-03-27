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
  `location` varchar(50) NOT NULL,
  `profileid` int(11) NOT NULL,
  `dst-start` datetime NOT NULL,
  `dst-end` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `mosque_profile`
--

CREATE TABLE `mosque_profile` (
  `mosque_id` int(11) NOT NULL,
  `profile_id` int(11) NOT NULL,
  PRIMARY KEY (`mosque_id`,`profile_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `prayertimes`
--

CREATE TABLE `prayertimes` (
  `mosque_id` int(11) NOT NULL,
  `month` smallint(6) NOT NULL,
  `day` smallint(6) NOT NULL,
  `fajr` varchar(5) NOT NULL,
  `shuruq` varchar(5) NOT NULL,
  `duhr` varchar(5) NOT NULL,
  `asr` varchar(5) NOT NULL,
  `maghrib` varchar(5) NOT NULL,
  `isha` varchar(5) NOT NULL,
  PRIMARY KEY (`mosque_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `profile`
--

CREATE TABLE `profile` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fieldname` varchar(30) NOT NULL,
  `fieldtype` varchar(20) NOT NULL,
  `fieldcontent` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;
