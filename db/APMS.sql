-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: May 01, 2025 at 08:43 PM
-- Server version: 8.0.35
-- PHP Version: 8.2.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `APMS`
--

-- --------------------------------------------------------

--
-- Table structure for table `conversation`
--

CREATE TABLE `conversation` (
  `conversation_id` int NOT NULL,
  `subject` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `message_id` int NOT NULL,
  `sender_user_id` int DEFAULT NULL,
  `recipient_user_id` int DEFAULT NULL,
  `content` text,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `conversation_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `module`
--

CREATE TABLE `module` (
  `module_id` int NOT NULL,
  `subject_code` varchar(255) DEFAULT NULL,
  `subject_catalog` int DEFAULT NULL,
  `module_title` varchar(255) NOT NULL,
  `credit_value` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `module`
--

INSERT INTO `module` (`module_id`, `subject_code`, `subject_catalog`, `module_title`, `credit_value`) VALUES
(110, 'IFSY', 123, 'Database Fundamentals', 20),
(111, 'IFSY', 126, 'Fundamentals of Comp Sci', 20),
(112, 'IFSY', 127, 'Programming I', 20),
(113, 'IFSY', 130, 'Web Technologies', 20),
(114, 'IFSY', 131, 'Design Patterns in Software', 20),
(115, 'IFSY', 133, 'System Architecture', 20),
(116, 'IFSY', 256, 'Systems Security', 20),
(117, 'IFSY', 258, 'Software Engineering and Development', 40),
(118, 'IFSY', 259, 'C++ Programming', 20),
(119, 'IFSY', 260, 'Information Computation', 20),
(120, 'IFSY', 265, 'Programming for Business Analytics', 20),
(121, 'IFSY', 125, 'Procedural Programming', 20),
(122, 'IFSY', 129, 'Object Oriented Programming', 20),
(123, 'BSAS', 102, 'Fundamentals of Accounting Analysis', 20),
(124, 'BSAS', 109, 'Organisational Behaviour Analysis', 20),
(125, 'BSAS', 205, 'Operations Management Data', 20),
(126, 'BSAS', 213, 'Human Resource Analytics', 20),
(127, 'BSAS', 219, 'Leading with Statistics', 20),
(128, 'FINA', 107, 'Economics for Business', 20),
(129, 'IFSY', 124, 'Programming and Systems', 40),
(130, 'IFSY', 254, 'HCI Research', 20),
(131, 'IFSY', 257, 'Modern App Programming', 20),
(132, 'MECH', 101, 'Mathematics I', 20),
(133, 'MECH', 104, 'Mechanics I', 20),
(134, 'MECH', 108, 'Dynamics I', 20),
(135, 'MECH', 118, 'Fluid Mechanics', 20),
(136, 'MECH', 127, 'Engineering', 20),
(137, 'MECH', 134, 'Mechanical Engineering I', 20),
(138, 'IFSY', 262, 'Artificial Intelligent Systems', 20),
(139, 'IFSY', 132, 'System Security Principles', 20),
(140, 'NUMS', 101, 'Calculus I', 30),
(141, 'NUMS', 102, 'Datatypes', 30),
(142, 'MATA', 121, 'Mathematical Approaches', 10),
(143, 'NUMS', 210, 'Maths and Employability', 0),
(144, 'NUMS', 211, 'Algebra', 20),
(145, 'NUMS', 221, 'Methods and Mathematics', 20),
(146, 'NUMS', 231, 'Advanced Mechanics', 20),
(147, 'BSAS', 211, 'International Business Analysis', 20),
(148, 'BSAS', 227, 'Contemporary Operations', 20),
(149, 'IFSY', 251, 'Systems Admin and Support', 20),
(150, 'IFSY', 252, 'Server Side Web Development', 20),
(151, 'IFSY', 253, 'Introduction to Enterprise Com', 20),
(152, 'IFSY', 266, 'Networks and Protocols', 20),
(153, 'SOUN', 130, 'Audio Mixing Approaches', 10),
(154, 'SOUN', 101, 'Creative Music', 20),
(155, 'SOUN', 112, 'Composition II', 20),
(156, 'SOUN', 233, 'Experimental Sounds', 20),
(157, 'SOUN', 213, 'Systems and Interactivity', 20),
(158, 'SOUN', 105, 'Composition I', 20),
(159, 'SOUN', 102, 'Music Fundamentals', 20),
(160, 'SOUN', 136, 'Synthesis of Sound', 10),
(161, 'SOUN', 248, 'Production in Live Venues', 20),
(162, 'SOUN', 252, ' Music Psychology', 20),
(163, 'SOUN', 255, 'Creative Songwriting', 20),
(164, 'SOUN', 138, 'Sound Production I', 20),
(165, 'SOUN', 238, 'Audio Production I', 20),
(166, 'BSAS', 112, 'Business Analytics', 20),
(167, 'LEGA', 127, 'Employability and Law', 0),
(168, 'LEGA', 128, 'Legal Methods', 20),
(169, 'LEGA', 129, 'Constitutional Studies', 40),
(170, 'LEGA', 130, 'Fundamentals to Criminal Law', 20),
(171, 'LEGA', 131, 'Law in Business', 20),
(172, 'LEGA', 132, 'Legal Studies', 20),
(173, 'PMEC', 121, 'Reasoning for Maths', 10),
(174, 'IFSY', 128, 'Advanced Computer Science', 20),
(175, 'IFSY', 211, 'Computing Practice', 10),
(176, 'IFSY', 264, 'Transferrable Skills for IT', 10),
(177, 'IFSY', 234, 'Professional Experience', 120),
(178, 'BSAS', 101, 'Introductory to Finance Theory', 20),
(179, 'BSAS', 103, 'Introductory Statistics in Management', 20),
(180, 'BSAS', 105, 'Legal Data Fundamentals', 20),
(181, 'FINA', 109, 'Quantitative Research', 20),
(182, 'FINA', 113, 'Economy Analysis', 40),
(183, 'SMAT', 199, 'Mathematics', 0),
(184, 'ECIV', 110, 'Surveying I', 20),
(185, 'ECIV', 115, 'Mathematical Foundations', 20),
(186, 'ECIV', 117, 'Introduction to Solids and Structures', 20),
(187, 'ECIV', 118, 'Construction Practices', 20),
(188, 'ECIV', 121, 'Hydraulics', 20),
(189, 'ECIV', 122, 'Communication and Design', 20),
(190, 'ECIV', 217, 'Advanced Geotechnics', 20),
(191, 'ECIV', 218, 'Hydraulics II', 20),
(192, 'ECIV', 262, 'Mechanics and Structures', 20),
(193, 'ECIV', 264, 'Communications and Design II', 20),
(194, 'ECIV', 265, 'Coding and Maths II', 20),
(195, 'ECIV', 266, 'Practical Infrastructure', 20),
(196, 'BSAS', 209, 'Data and Statistics', 20),
(197, 'SCIE', 111, 'Physics Foundations', 20),
(198, 'SCIE', 112, 'Computational Approaches', 20),
(199, 'SCIE', 113, 'Physics I', 20),
(200, 'SCIE', 122, 'Foundations in Physics II', 20),
(201, 'SCIE', 124, 'Computational Modelling', 20),
(202, 'SCIE', 126, 'Physics and Maths', 20),
(203, 'IFSY', 109, 'Software Engineering Fundamentals', 20),
(204, 'IFSY', 117, 'Reasoning for Problem Solving', 20),
(205, 'IFSY', 118, 'Fnd of Computing Systems', 40),
(206, 'IFSY', 120, 'Programming', 40),
(207, 'IFSY', 242, 'Information Modelling', 10),
(208, 'IFSY', 239, 'Architecture and Networks', 10),
(209, 'IFSY', 240, 'Data Structures Algorithms PL', 30),
(210, 'IFSY', 244, 'Software Development', 30),
(211, 'IFSY', 247, 'Theory of Computation', 30),
(212, 'MIND', 108, 'Psychology Fundamentals', 40),
(213, 'MIND', 109, 'Methods in Psychology', 40),
(214, 'MIND', 110, 'Psychology I', 40),
(215, 'IFSY', 261, 'Networks and Architecture', 20),
(216, 'NUMS', 111, 'Algebra Foundations', 30),
(217, 'STAT', 120, 'Probability & Statistics I', 30),
(218, 'IFSY', 263, 'Service-Oriented Programming', 20);

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `notification_id` int NOT NULL,
  `subject` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `content` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `program`
--

CREATE TABLE `program` (
  `program_id` int NOT NULL,
  `program_code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `program`
--

INSERT INTO `program` (`program_id`, `program_code`, `name`) VALUES
(1, 'ifsy', 'BSc Information Systems'),
(2, 'bsas', 'BSc Business Data Analytics');

-- --------------------------------------------------------

--
-- Table structure for table `program_module`
--

CREATE TABLE `program_module` (
  `program_module_id` int NOT NULL,
  `program_id` int NOT NULL,
  `module_id` int NOT NULL,
  `level` enum('L1','L2','L3','M') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `semester` enum('SPR','AUT','FYR','SUM') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_core` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `program_module`
--

INSERT INTO `program_module` (`program_module_id`, `program_id`, `module_id`, `level`, `semester`, `is_core`) VALUES
(1, 1, 115, 'L1', 'AUT', 0),
(2, 1, 121, 'L1', 'AUT', 0),
(3, 1, 111, 'L1', 'AUT', 0),
(4, 1, 112, 'L1', 'AUT', 0),
(5, 1, 110, 'L1', 'SPR', 0),
(6, 1, 174, 'L1', 'SPR', 0),
(7, 1, 122, 'L1', 'SPR', 0),
(8, 1, 113, 'L1', 'SPR', 0),
(9, 1, 114, 'L1', 'SPR', 0),
(10, 1, 139, 'L1', 'SPR', 0),
(11, 1, 118, 'L2', 'AUT', 1),
(12, 1, 120, 'L2', 'AUT', 0),
(13, 1, 207, 'L2', 'AUT', 0),
(14, 1, 175, 'L2', 'AUT', 0),
(15, 1, 176, 'L2', 'AUT', 0),
(16, 1, 117, 'L2', 'FYR', 0),
(17, 1, 209, 'L2', 'FYR', 1),
(18, 1, 211, 'L2', 'FYR', 0),
(19, 1, 210, 'L2', 'FYR', 0),
(20, 1, 208, 'L2', 'SPR', 0),
(21, 1, 120, 'L2', 'SPR', 0),
(22, 1, 116, 'L2', 'SPR', 0),
(23, 1, 119, 'L2', 'SPR', 0),
(24, 1, 138, 'L2', 'SPR', 0),
(25, 1, 215, 'L2', 'SPR', 0),
(26, 1, 208, 'L2', 'SPR', 0),
(27, 1, 152, 'L2', 'SPR', 0),
(28, 2, 123, 'L1', 'AUT', 0),
(29, 2, 124, 'L1', 'AUT', 0),
(30, 2, 129, 'L1', 'FYR', 0),
(31, 2, 166, 'L1', 'SPR', 0),
(32, 2, 127, 'L1', 'SPR', 0),
(33, 2, 110, 'L1', 'SPR', 0),
(34, 2, 128, 'L1', 'SPR', 0),
(35, 2, 196, 'L2', 'AUT', 0),
(36, 2, 147, 'L2', 'AUT', 0),
(37, 2, 126, 'L2', 'AUT', 0),
(38, 2, 175, 'L2', 'AUT', 0),
(39, 2, 176, 'L2', 'AUT', 0),
(40, 2, 120, 'L2', 'AUT', 0),
(41, 2, 127, 'L2', 'SPR', 0),
(42, 2, 148, 'L2', 'SPR', 0),
(43, 2, 130, 'L2', 'SPR', 0),
(44, 2, 131, 'L2', 'SPR', 1),
(45, 2, 125, 'L2', 'SPR', 0);

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `student_id` int NOT NULL,
  `user_id` int NOT NULL,
  `sId` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `status_study` enum('F','P') NOT NULL,
  `entry_level` enum('L1','L2','L3') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_module`
--

CREATE TABLE `student_module` (
  `user_module_id` int NOT NULL,
  `student_id` int NOT NULL,
  `module_id` int NOT NULL,
  `first_grade` int DEFAULT NULL,
  `grade_result` enum('pass','fail','excused','absent','pass capped') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `resit_grade` int DEFAULT NULL,
  `resit_result` enum('pass','excused','fail','absent','pass capped') DEFAULT NULL,
  `academic_year` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `secondary_email` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `salt` varchar(255) NOT NULL,
  `role` enum('student','admin') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `email`, `secondary_email`, `password`, `salt`, `role`) VALUES
(1, 'Admin01@university.edu', NULL, '$2b$12$znzj6Fw8QJg8LOCl/1Ceg.9OtuZv2xtXGTXACX//i4ewhdvyQsTEm', '$2b$12$znzj6Fw8QJg8LOCl/1Ceg.', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `user_notifications`
--

CREATE TABLE `user_notifications` (
  `user_notification_id` int NOT NULL,
  `user_id` int NOT NULL,
  `notification_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `conversation`
--
ALTER TABLE `conversation`
  ADD PRIMARY KEY (`conversation_id`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `message_ibfk_1` (`recipient_user_id`),
  ADD KEY `message_ibfk_2` (`sender_user_id`),
  ADD KEY `message_ibfk_3` (`conversation_id`);

--
-- Indexes for table `module`
--
ALTER TABLE `module`
  ADD PRIMARY KEY (`module_id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD UNIQUE KEY `notification_id` (`notification_id`);

--
-- Indexes for table `program`
--
ALTER TABLE `program`
  ADD PRIMARY KEY (`program_id`);

--
-- Indexes for table `program_module`
--
ALTER TABLE `program_module`
  ADD PRIMARY KEY (`program_module_id`),
  ADD KEY `program_pk` (`program_id`),
  ADD KEY `module_pk` (`module_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`student_id`),
  ADD KEY `user_pk` (`user_id`);

--
-- Indexes for table `student_module`
--
ALTER TABLE `student_module`
  ADD PRIMARY KEY (`user_module_id`),
  ADD KEY `student_pk` (`student_id`),
  ADD KEY `module_entrollement` (`module_id`),
  ADD KEY `user_module_id` (`user_module_id`,`student_id`,`module_id`,`first_grade`,`grade_result`,`resit_grade`,`resit_result`,`academic_year`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `user_notifications`
--
ALTER TABLE `user_notifications`
  ADD PRIMARY KEY (`user_notification_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `notification_id` (`notification_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `conversation`
--
ALTER TABLE `conversation`
  MODIFY `conversation_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `message`
--
ALTER TABLE `message`
  MODIFY `message_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `module`
--
ALTER TABLE `module`
  MODIFY `module_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=222;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `notification_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `program`
--
ALTER TABLE `program`
  MODIFY `program_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `program_module`
--
ALTER TABLE `program_module`
  MODIFY `program_module_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `student_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_module`
--
ALTER TABLE `student_module`
  MODIFY `user_module_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_notifications`
--
ALTER TABLE `user_notifications`
  MODIFY `user_notification_id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `message_ibfk_1` FOREIGN KEY (`recipient_user_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `message_ibfk_2` FOREIGN KEY (`sender_user_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `message_ibfk_3` FOREIGN KEY (`conversation_id`) REFERENCES `conversation` (`conversation_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `program_module`
--
ALTER TABLE `program_module`
  ADD CONSTRAINT `module_pk` FOREIGN KEY (`module_id`) REFERENCES `module` (`module_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `program_pk` FOREIGN KEY (`program_id`) REFERENCES `program` (`program_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `user_pk` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `student_module`
--
ALTER TABLE `student_module`
  ADD CONSTRAINT `module_entrollement` FOREIGN KEY (`module_id`) REFERENCES `module` (`module_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `student_pk` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `user_notifications`
--
ALTER TABLE `user_notifications`
  ADD CONSTRAINT `notification_id` FOREIGN KEY (`notification_id`) REFERENCES `notification` (`notification_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
