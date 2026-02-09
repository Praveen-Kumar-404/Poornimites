/**
 * Lakshya 2k26 Event Logic
 * Handles tabs and rendering of day-wise event schedules
 */

// Festival Dates (Feb 11-15, 2026)
const LAKSHYA_DATES = {
    day0: '2026-02-11',
    day1: '2026-02-12',
    day2: '2026-02-13',
    day3: '2026-02-14',
    day4: '2026-02-15'
};
// Event Data for 5 Days (Day 0 to Day 4)
const LAKSHYA_EVENTS = {
    day0: [
        { sno: 1, committee: "â€“", event: "Student Arrival", venue: "â€“", time: "10:00 AM â€“ 12:00 PM", coordinators: "â€“", phone: "â€“" },
        { sno: 2, committee: "â€“", event: "Student Check-in Procedure", venue: "â€“", time: "10:00 AM â€“ 12:00 PM", coordinators: "â€“", phone: "â€“" },
        { sno: 3, committee: "â€“", event: "College Bus Arrival", venue: "â€“", time: "11:00 AM", coordinators: "â€“", phone: "â€“" },
        { sno: 4, committee: "E-Sports", event: "Asphalt (PC)", venue: "Lab 342, 347, 348", time: "11:00 AM â€“ 03:00 PM", coordinators: "Sparsh Dhamotiya", phone: "6377930321" },
        { sno: 5, committee: "Sports", event: "Billiards Singles (Mix)", venue: "Billiards Room (H2 Boys Hostel)", time: "11:00 AM â€“ 03:00 PM", coordinators: "Sam, Vijay", phone: "6376304216, 6375687833" },
        { sno: 6, committee: "Sports", event: "Table Tennis (Mix)", venue: "Old Gym", time: "11:00 AM â€“ 03:00 PM", coordinators: "Yashveer, Chaitanya Drona", phone: "9024761872, 9084780057" },
        { sno: 7, committee: "Sports", event: "Foosball (Mix)", venue: "Billiards Room (H2 Boys Hostel)", time: "11:00 AM â€“ 03:00 PM", coordinators: "Prayag", phone: "8949185419" },
        { sno: 8, committee: "Sports", event: "Skipping Rope (Mix)", venue: "Basketball Court #2", time: "11:00 AM â€“ 01:00 PM", coordinators: "Adhyan", phone: "8252321290" },
        { sno: 9, committee: "Sports", event: "Shuttle Run (Boys)", venue: "Basketball Court #1", time: "11:00 AM â€“ 01:00 PM", coordinators: "Madhav, Irfan", phone: "6263518453, 9358560159" },
        { sno: 10, committee: "Sports", event: "Shot Put (Boys)", venue: "Volleyball Court", time: "11:00 AM â€“ 01:00 PM", coordinators: "Raghvendra, Rajat", phone: "8949684334, 9510982522" },
        { sno: 11, committee: "Sports", event: "Pole Hanging (Boys)", venue: "Fitness Studio", time: "11:00 AM â€“ 01:00 PM", coordinators: "Chitransh, Shubham", phone: "9521658016, 9352607762" },
        { sno: 12, committee: "Sports", event: "Standing Broad Jump (Boys)", venue: "Volleyball Court", time: "11:00 AM â€“ 12:00 PM", coordinators: "Bhavesh, Nischal", phone: "7412984703, 8003973197" },
        { sno: 13, committee: "Sports", event: "Standing Broad Jump (Girls)", venue: "Volleyball Court", time: "12:00 PM â€“ 01:00 PM", coordinators: "Bhavesh, Nischal", phone: "7412984703, 8003973197" },
        { sno: 14, committee: "Sports", event: "Plank Holding (Boys)", venue: "In front of H1 Boys Hostel", time: "12:00 PM â€“ 01:00 PM", coordinators: "Sandeep Bhargav, Ravindra", phone: "8209375959, 9521534382" },
        { sno: 15, committee: "Sports", event: "Push-ups (Boys)", venue: "In front of H1 Boys Hostel", time: "12:00 PM â€“ 01:30 PM", coordinators: "Pranjal Srivastava, Himanshu", phone: "8808167533, 9799513799" },
        { sno: 16, committee: "Sports", event: "Shuttle Run (Girls)", venue: "Basketball Court #1", time: "01:00 PM â€“ 03:00 PM", coordinators: "Madhav, Irfan", phone: "6263518453, 9358560159" },
        { sno: 17, committee: "Sports", event: "Pole Hanging (Girls)", venue: "Fitness Studio", time: "01:00 PM â€“ 03:00 PM", coordinators: "Chitransh, Shubham", phone: "9521658016, 9352607762" },
        { sno: 18, committee: "Sports", event: "Shot Put (Girls)", venue: "Volleyball Court", time: "01:00 PM â€“ 03:00 PM", coordinators: "Raghvendra, Rajat", phone: "8949684334, 9510982522" },
        { sno: 19, committee: "Sports", event: "Plank Holding (Girls)", venue: "In front of H1 Boys Hostel", time: "01:00 PM â€“ 02:00 PM", coordinators: "Sandeep Bhargav, Ravindra", phone: "8209375959, 9521534382" },
        { sno: 20, committee: "Sports", event: "Push-ups (Girls)", venue: "In front of H1 Boys Hostel", time: "01:30 PM â€“ 03:00 PM", coordinators: "Pranjal Srivastava, Himanshu", phone: "8808167533, 9799513799" },
        { sno: 21, committee: "â€“", event: "Under-25 Summit", venue: "Lakshya Grand Arena Stage", time: "03:00 PM â€“ 07:00 PM", coordinators: "Uma Todi", phone: "â€“" },
        { sno: 22, committee: "â€“", event: "Special Performance", venue: "Trackside Stage, Porch Area", time: "07:00 PM onwards", coordinators: "Suhani Agarwal", phone: "â€“" }
    ],
    day1: [
        { sno: 1, committee: "â€“", event: "Student Arrival", venue: "â€“", time: "10:00 AM â€“ 12:00 PM", coordinators: "â€“", phone: "â€“" },
        { sno: 2, committee: "â€“", event: "Student Check-in Procedure", venue: "â€“", time: "10:00 AM â€“ 12:00 PM", coordinators: "â€“", phone: "â€“" },
        { sno: 3, committee: "â€“", event: "College Bus Arrival", venue: "â€“", time: "11:00 AM", coordinators: "â€“", phone: "â€“" },
        { sno: 4, committee: "E-Sports", event: "BGMI", venue: "Classroom", time: "11:00 AM â€“ 05:00 PM", coordinators: "Sparsh Dhamotiya", phone: "6377930321" },
        { sno: 5, committee: "Sports", event: "Billiards Doubles (Mix)", venue: "Billiards Room (H2 Boys Hostel)", time: "11:00 AM â€“ 05:00 PM", coordinators: "Sam", phone: "6376304216" },
        { sno: 6, committee: "Sports", event: "Basketball Boys (R1)", venue: "Basketball Court #1", time: "11:00 AM â€“ 05:00 PM", coordinators: "Ravindra", phone: "9521534382" },
        { sno: 7, committee: "Sports", event: "Basketball Girls (R1)", venue: "Basketball Court #2", time: "11:00 AM â€“ 05:00 PM", coordinators: "Pranjal, Chitransh", phone: "8808167533, 9521658016" },
        { sno: 8, committee: "Sports", event: "Volleyball Boys (R1)", venue: "Volleyball Court #1", time: "11:00 AM â€“ 05:00 PM", coordinators: "Rajat", phone: "9510982522" },
        { sno: 9, committee: "Sports", event: "Volleyball Girls (R1)", venue: "Volleyball Court #2", time: "11:00 AM â€“ 05:00 PM", coordinators: "Shubham Shekhawat", phone: "9352607762" },
        { sno: 10, committee: "Sports", event: "Football Boys 7-a-side (R1)", venue: "Football Ground", time: "11:00 AM â€“ 05:00 PM", coordinators: "Madhav, Nischal", phone: "6263518453, 8003973197" },
        { sno: 11, committee: "Sports", event: "Football Girls 7-a-side (R1)", venue: "Football Ground", time: "11:00 AM â€“ 05:00 PM", coordinators: "Chaitanya Drona", phone: "9084780057" },
        { sno: 12, committee: "Sports", event: "Kabaddi Boys (R1)", venue: "Kabaddi Court", time: "11:00 AM â€“ 05:00 PM", coordinators: "Bhavesh, Irfan, Himanshu", phone: "7412984703" },
        { sno: 13, committee: "Sports", event: "Pickleball Boys (R1)", venue: "Pickleball Court", time: "11:00 AM â€“ 05:00 PM", coordinators: "Prayag", phone: "8949185419" },
        { sno: 14, committee: "Sports", event: "Box Cricket Boys (R1)", venue: "Football Ground", time: "11:00 AM â€“ 05:00 PM", coordinators: "Sandeep Bhargav", phone: "8209375959" },
        { sno: 15, committee: "Sports", event: "Chess (Mix)", venue: "Near Parking", time: "11:00 AM â€“ 05:00 PM", coordinators: "Yashveer", phone: "9024761872" },
        { sno: 16, committee: "Sports", event: "Carrom (Mix)", venue: "Near Parking", time: "11:00 AM â€“ 05:00 PM", coordinators: "Adhyan", phone: "8252321290" },
        { sno: 17, committee: "Sports", event: "Deadlift (Boys)", venue: "In front of New Gym", time: "11:00 AM â€“ 05:00 PM", coordinators: "Vijay", phone: "6375687833" },
        { sno: 18, committee: "Sports", event: "Pickleball Girls (R1)", venue: "Pickleball Court", time: "11:00 AM â€“ 05:00 PM", coordinators: "Prayag", phone: "8949185419" },
        { sno: 19, committee: "Sports", event: "400m Sprint (Both)", venue: "Cricket Ground", time: "11:00 AM â€“ 02:00 PM", coordinators: "Bhavesh, Raghvendra", phone: "7412984703, 8949684334" },
        { sno: 20, committee: "Cultural", event: "Cosplay", venue: "Trackside Stage, Porch Area", time: "11:00 AM â€“ 01:00 PM", coordinators: "Anwesha Shandilya, Rishabh", phone: "7597396227, 9352609423" },
        { sno: 21, committee: "Edufun", event: "Triathlon", venue: "Gate No. 4", time: "11:00 AM â€“ 01:00 PM", coordinators: "Manav, Nikhil, Asit, Dakshina", phone: "8233441107, 9929697343" },
        { sno: 22, committee: "Edufun", event: "Fest Vlog Challenge", venue: "Cafegram", time: "11:00 AM â€“ 01:00 PM", coordinators: "Chaitanya, Avni", phone: "9660682505, 9119207340" },
        { sno: 23, committee: "Edufun", event: "Skribble", venue: "Cafegram", time: "11:00 AM â€“ 01:00 PM", coordinators: "Rudrakshi, Vishwash", phone: "6350667131, 9380609469" },
        { sno: 24, committee: "Edufun", event: "Dumb Charades", venue: "Ground Floor Seminar Hall", time: "01:00 PM â€“ 03:00 PM", coordinators: "Shreekala, Rehan", phone: "9558786799, 6354091137" },
        { sno: 25, committee: "Cultural", event: "Group Singing", venue: "Trackside Stage, Porch Area", time: "01:00 PM â€“ 03:00 PM", coordinators: "Riddhi, Charming, Shreyansh", phone: "7409933055, 9057490975, 9137441085" },
        { sno: 26, committee: "Edufun", event: "Mandala Art", venue: "Cafegram", time: "01:00 PM â€“ 03:00 PM", coordinators: "Divyanshi, Rudrakshi", phone: "8769634401, 6350667131" },
        { sno: 27, committee: "Sports", event: "100m Sprint (Both)", venue: "Cricket Ground", time: "02:00 PM â€“ 04:00 PM", coordinators: "Bhavesh, Raghvendra", phone: "7412984703, 8949684334" },
        { sno: 28, committee: "Edufun", event: "The Art of Thread", venue: "Cafegram", time: "03:00 PM â€“ 05:00 PM", coordinators: "Avni, Vishwash", phone: "9119207340, 9380609469" },
        { sno: 29, committee: "Edufun", event: "Jenga", venue: "Academic Block Stairs", time: "03:00 PM â€“ 05:00 PM", coordinators: "Nikhil, Asit", phone: "9929697343, 8448895752" },
        { sno: 30, committee: "Cultural", event: "Video Game Dance", venue: "Trackside Stage, Porch Area", time: "03:00 PM â€“ 05:00 PM", coordinators: "Yati Gowswami, Yash Khandelwal", phone: "7727945904, 6376755155" },
        { sno: 31, committee: "Edufun", event: "Antakshari", venue: "Ground Floor Seminar Hall", time: "03:00 PM â€“ 05:00 PM", coordinators: "Shreekala, Divyanshi", phone: "9558786799, 8769634401" },
        { sno: 32, committee: "Edufun", event: "Guess the Item", venue: "Cafegram", time: "03:00 PM â€“ 05:00 PM", coordinators: "Rehan, Dakshina", phone: "6354091137, 9425926659" },
        { sno: 33, committee: "Edufun", event: "Bro in Flow Power Stop", venue: "Park Stage, CP", time: "03:00 PM â€“ 05:00 PM", coordinators: "Manav, Rudrakshi", phone: "8233441107, 6350667131" },
        { sno: 34, committee: "â€“", event: "Inaugural Ceremony", venue: "Lakshya Grand Arena Stage", time: "06:00 PM onwards", coordinators: "Uma Todi", phone: "â€“" },
        { sno: 35, committee: "â€“", event: "Raitila Rajasthan Performance", venue: "Lakshya Grand Arena Stage", time: "07:00 PM â€“ 09:00 PM", coordinators: "Uma Todi", phone: "â€“" },
        { sno: 36, committee: "â€“", event: "Illuminati Dance Crew", venue: "Lakshya Grand Arena Stage", time: "09:00 PM onwards", coordinators: "Aaryan Singh", phone: "â€“" },
        { sno: 37, committee: "â€“", event: "After Party DJ", venue: "Trackside Stage, Porch Area", time: "10:30 PM onwards", coordinators: "Pranjal Yadav", phone: "â€“" }
    ],
    day2: [
        { sno: 1, committee: "â€“", event: "Student Arrival", venue: "â€“", time: "10:00 AM â€“ 12:00 PM", coordinators: "â€“", phone: "â€“" },
        { sno: 2, committee: "â€“", event: "Student Check-in Procedure", venue: "â€“", time: "10:00 AM â€“ 12:00 PM", coordinators: "â€“", phone: "â€“" },
        { sno: 3, committee: "â€“", event: "College Bus Arrival", venue: "â€“", time: "11:00 AM", coordinators: "â€“", phone: "â€“" },
        { sno: 4, committee: "E-Sports", event: "FIFA (EAFC)", venue: "Lab 342, 347, 348", time: "11:00 AM â€“ 05:00 PM", coordinators: "Sparsh Dhamotiya", phone: "6377930321" },
        { sno: 5, committee: "Sports", event: "Basketball Boys (Round 2+3)", venue: "Basketball Court #1", time: "11:00 AM â€“ 05:00 PM", coordinators: "Ravindra", phone: "9521534382" },
        { sno: 6, committee: "Sports", event: "Basketball Girls (Round 2+3)", venue: "Basketball Court #2", time: "11:00 AM â€“ 05:00 PM", coordinators: "Pranjal, Chitransh", phone: "8808167533, 9521658016" },
        { sno: 7, committee: "Sports", event: "Volleyball Boys (Round 2+3)", venue: "Volleyball Court #1", time: "11:00 AM â€“ 05:00 PM", coordinators: "Rajat", phone: "9510982522" },
        { sno: 8, committee: "Sports", event: "Volleyball Girls (Round 2+3)", venue: "Volleyball Court #2", time: "11:00 AM â€“ 05:00 PM", coordinators: "Shubham Shekhawat", phone: "9352607762" },
        { sno: 9, committee: "Sports", event: "Football Boys 7-a-side (R2+3)", venue: "Football Ground", time: "11:00 AM â€“ 05:00 PM", coordinators: "Madhav, Nischal", phone: "6263518453, 8003973197" },
        { sno: 10, committee: "Sports", event: "Football Girls 7-a-side (R2+3)", venue: "Football Ground", time: "11:00 AM â€“ 05:00 PM", coordinators: "Chaitanya Drona", phone: "9084780057" },
        { sno: 11, committee: "Sports", event: "Bench Press (Boys)", venue: "In front of New Gym", time: "11:00 AM â€“ 05:00 PM", coordinators: "Pranjal Srivastava", phone: "8808167533" },
        { sno: 12, committee: "Sports", event: "Box Cricket Girls (R1)", venue: "Football Ground", time: "11:00 AM â€“ 05:00 PM", coordinators: "Sandeep Bhargav", phone: "8209375959" },
        { sno: 13, committee: "Sports", event: "Kabaddi Girls (R1)", venue: "Kabaddi Court", time: "11:00 AM â€“ 05:00 PM", coordinators: "Bhavesh, Irfan, Himanshu", phone: "7412984703" },
        { sno: 14, committee: "Sports", event: "Pickleball Boys (R2+3)", venue: "Pickleball Court", time: "11:00 AM â€“ 05:00 PM", coordinators: "Prayag", phone: "8949185419" },
        { sno: 15, committee: "Sports", event: "Pickleball Girls (R2+3)", venue: "Pickleball Court", time: "11:00 AM â€“ 05:00 PM", coordinators: "Prayag", phone: "8949185419" },
        { sno: 16, committee: "Sports", event: "Squats (Boys)", venue: "In front of New Gym", time: "11:00 AM â€“ 05:00 PM", coordinators: "Vijay", phone: "6375687833" },
        { sno: 17, committee: "Edufun", event: "Go Karting", venue: "Racing Track, Porch Area", time: "11:00 AM â€“ 02:00 PM", coordinators: "Nikhil, Manav", phone: "9929697343, 8233441107" },
        { sno: 18, committee: "Sports", event: "200m Sprint (Both)", venue: "Cricket Ground", time: "11:00 AM â€“ 01:00 PM", coordinators: "Bhavesh, Raghvendra", phone: "7412984703, 8949684334" },
        { sno: 19, committee: "Cultural", event: "Duet Singing", venue: "Ground Floor Seminar Hall", time: "11:00 AM â€“ 01:00 PM", coordinators: "Shreyansh, Riddhi, Yuvraj", phone: "9137441085, 7409933055" },
        { sno: 20, committee: "Edufun", event: "Treasure Hunt", venue: "Behind Admin-2", time: "11:00 AM â€“ 01:00 PM", coordinators: "Shreekala, Dakshina, Asit, Manav", phone: "9558786799, 9425926659" },
        { sno: 21, committee: "Edufun", event: "Reel Hunt", venue: "Behind Admin-2", time: "11:00 AM â€“ 01:00 PM", coordinators: "Prince, Vishwash", phone: "8448895752" },
        { sno: 22, committee: "Edufun", event: "Love â€“ LED Makeover", venue: "Football Ground Pavilion", time: "11:00 AM â€“ 01:00 PM", coordinators: "Divyanshi, Rehan", phone: "8769634401" },
        { sno: 23, committee: "Edufun", event: "Formula Ink", venue: "PU Canteen", time: "11:00 AM â€“ 01:00 PM", coordinators: "Avni, Rudrakshi", phone: "6354091137" },
        { sno: 24, committee: "Cultural", event: "Stage Act", venue: "Power Stop Park Stage, CP", time: "01:00 PM â€“ 03:00 PM", coordinators: "Yati, Anwesha Shandilya", phone: "9119207340" },
        { sno: 25, committee: "Cultural", event: "Stand-up Comedy", venue: "Ground Floor Seminar Hall", time: "01:00 PM â€“ 03:00 PM", coordinators: "Rishabh Tater, Charming", phone: "7727945904" },
        { sno: 26, committee: "Sports", event: "Three-Legged Race (Girls)", venue: "Cricket Ground", time: "01:00 PM â€“ 03:00 PM", coordinators: "Adhyan, Yashveer", phone: "9352609423" },
        { sno: 27, committee: "Sports", event: "Tug of War Boys (R1)", venue: "Football Ground", time: "01:00 PM â€“ 03:00 PM", coordinators: "Shubham Shekhawat", phone: "9057490975" },
        { sno: 28, committee: "Edufun", event: "Capture the Moment", venue: "Cafegram", time: "01:00 PM â€“ 03:00 PM", coordinators: "Prince, Nikhil, Manav", phone: "8252321290" },
        { sno: 29, committee: "Edufun", event: "Write Your Mind", venue: "Behind Admin-2", time: "01:00 PM â€“ 03:00 PM", coordinators: "Divyanshi, Rehan", phone: "9352607762" },
        { sno: 30, committee: "Cultural", event: "Dance Battle", venue: "Trackside Stage, Porch Area", time: "02:00 PM â€“ 04:00 PM", coordinators: "Shreyansh, Anwesha, Yash", phone: "8079056866" },
        { sno: 31, committee: "Edufun", event: "PU Shark Tank", venue: "Ground Floor Seminar Hall", time: "03:00 PM â€“ 06:00 PM", coordinators: "Nikhil, Avni, Rudrakshi", phone: "9380609469" },
        { sno: 32, committee: "Sports", event: "Tug of War Girls (R1)", venue: "Football Ground", time: "03:00 PM â€“ 05:00 PM", coordinators: "Shubham Shekhawat", phone: "7742573812" },
        { sno: 33, committee: "â€“", event: "Hetwik Singh Live", venue: "Power Stop Park Stage, CP", time: "03:00 PM â€“ 05:00 PM", coordinators: "Suhani Agarwal", phone: "8769634401" },
        { sno: 34, committee: "Edufun", event: "Music Video Making", venue: "Cafegram", time: "03:00 PM â€“ 05:00 PM", coordinators: "Prince, Vishwash", phone: "7409933055" },
        { sno: 35, committee: "Edufun", event: "Poster Making", venue: "Behind Admin-2", time: "03:00 PM â€“ 05:00 PM", coordinators: "Shahid Khan, Divyanshi", phone: "9057490975" },
        { sno: 36, committee: "Cultural", event: "Battle of Bands", venue: "Trackside Stage, Porch Area", time: "04:00 PM â€“ 06:00 PM", coordinators: "Riddhi, Charming, Yati", phone: "7727945904" },
        { sno: 37, committee: "â€“", event: "Gajendra Verma Live", venue: "Lakshya Grand Arena Stage", time: "07:30 PM onwards", coordinators: "Uma Todi", phone: "â€“" },
        { sno: 38, committee: "â€“", event: "Headliners Band Performance", venue: "Lakshya Grand Arena Stage", time: "06:00 PM onwards", coordinators: "Uma Todi", phone: "â€“" },
        { sno: 39, committee: "â€“", event: "After Party DJ", venue: "Trackside Stage, Porch Area", time: "10:30 PM onwards", coordinators: "Pranjal Yadav", phone: "â€“" }
    ],
    day3: [
        { sno: 1, committee: "â€“", event: "Student Arrival", venue: "â€“", time: "10:00 AM â€“ 12:00 PM", coordinators: "â€“", phone: "â€“" },
        { sno: 2, committee: "â€“", event: "Student Check-in Procedure", venue: "â€“", time: "10:00 AM â€“ 12:00 PM", coordinators: "â€“", phone: "â€“" },
        { sno: 3, committee: "â€“", event: "College Bus Arrival", venue: "â€“", time: "11:00 AM", coordinators: "â€“", phone: "â€“" },
        { sno: 4, committee: "E-Sports", event: "Rocket League (PC)", venue: "Lab 342, 347, 348", time: "11:00 AM â€“ 05:00 PM", coordinators: "Sparsh Dhamotiya", phone: "6377930321" },
        { sno: 5, committee: "Sports", event: "Kabaddi Girls (R2+3)", venue: "Kabaddi Court", time: "11:00 AM â€“ 05:00 PM", coordinators: "Bhavesh, Irfan, Himanshu", phone: "7412984703" },
        { sno: 6, committee: "Sports", event: "Badminton Doubles Mix (R1)", venue: "Badminton Court", time: "11:00 AM â€“ 05:00 PM", coordinators: "Adhyan, Yashveer", phone: "8252321290" },
        { sno: 7, committee: "Sports", event: "Lawn Tennis Mix (R1)", venue: "Tennis Court", time: "11:00 AM â€“ 05:00 PM", coordinators: "Nischal", phone: "9024761872" },
        { sno: 8, committee: "Sports", event: "Box Cricket Boys (R2+3)", venue: "Football Ground", time: "11:00 AM â€“ 05:00 PM", coordinators: "Sandeep Bhargav", phone: "8003973197" },
        { sno: 9, committee: "Sports", event: "Arm Wrestling (Boys)", venue: "Fitness Studio", time: "11:00 AM â€“ 02:00 PM", coordinators: "Vijay, Prayag", phone: "8209375959" },
        { sno: 10, committee: "Edufun", event: "No Gas Cooking", venue: "PIHM Mess", time: "11:00 AM â€“ 02:00 PM", coordinators: "Vishwash, Shreekala", phone: "6375687833" },
        { sno: 11, committee: "Sports", event: "Medicine Ball Throw (Boys)", venue: "Volleyball Court", time: "11:00 AM â€“ 01:00 PM", coordinators: "Ravindra, Chaitanya Drona", phone: "9380609469" },
        { sno: 12, committee: "Cultural", event: "Mimicry", venue: "Trackside Stage, Porch Area", time: "11:00 AM â€“ 01:00 PM", coordinators: "Rishabh Tater, Yati", phone: "9521534382" },
        { sno: 13, committee: "Edufun", event: "Together Always", venue: "Cafegram", time: "11:00 AM â€“ 01:00 PM", coordinators: "Asit, Rudrakshi", phone: "9303036048" },
        { sno: 14, committee: "Cultural", event: "On-Spot Slam Poetry", venue: "Ground Floor Seminar Hall", time: "11:00 AM â€“ 01:00 PM", coordinators: "Shreyansh, Riddhi, Charming", phone: "8448827288" },
        { sno: 15, committee: "Edufun", event: "Lift of Love", venue: "Power Stop Park Stage, CP", time: "11:00 AM â€“ 01:00 PM", coordinators: "Nikhil, Avni, Rehan", phone: "9137441085" },
        { sno: 16, committee: "Edufun", event: "Mine Field", venue: "Football Ground", time: "11:00 AM â€“ 01:00 PM", coordinators: "Manav, Dakshina", phone: "9929697343" },
        { sno: 17, committee: "â€“", event: "Special Show", venue: "Racing Track, Porch Area", time: "12:00 PM â€“ 02:00 PM", coordinators: "Drishti Tiwari", phone: "â€“" },
        { sno: 18, committee: "Sports", event: "Three-Legged Race (Boys)", venue: "Cricket Ground", time: "12:00 PM â€“ 02:00 PM", coordinators: "Madhav, Raghvendra", phone: "6263518453" },
        { sno: 19, committee: "Edufun", event: "Push Four Love", venue: "Power Stop Park Stage, CP", time: "01:00 PM â€“ 03:00 PM", coordinators: "Divyanshi, Rehan, Asit", phone: "9425926659" },
        { sno: 20, committee: "Edufun", event: "Extempore with Twist", venue: "Ground Floor Seminar Hall", time: "01:00 PM â€“ 03:00 PM", coordinators: "Manav, Rudrakshi", phone: "8233441107" },
        { sno: 21, committee: "Sports", event: "Medicine Ball Throw (Girls)", venue: "Volleyball Court", time: "01:00 PM â€“ 03:00 PM", coordinators: "Rajat", phone: "9510982522" },
        { sno: 22, committee: "Edufun", event: "Red Light â€“ Green Light", venue: "Football Ground", time: "01:00 PM â€“ 03:00 PM", coordinators: "Dakshina, Vishwash, Nikhil", phone: "9425926659" },
        { sno: 23, committee: "Sports", event: "Tug of War Boys (R1)", venue: "Football Ground", time: "01:00 PM â€“ 03:00 PM", coordinators: "Shubham Shekhawat", phone: "9352607762" },
        { sno: 24, committee: "Sports", event: "Deadlift (Girls)", venue: "In front of Fitness Studio", time: "02:00 PM â€“ 05:00 PM", coordinators: "Vijay, Prayag", phone: "6375687833" },
        { sno: 25, committee: "Sports", event: "Bench Press (Girls)", venue: "In front of Fitness Studio", time: "02:00 PM â€“ 05:00 PM", coordinators: "Pranjal, Chitransh", phone: "8808167533" },
        { sno: 26, committee: "Cultural", event: "Fashion Walk", venue: "Trackside Stage, Porch Area", time: "02:00 PM â€“ 04:00 PM", coordinators: "Anwesha, Yati, Yash", phone: "7597396227" },
        { sno: 27, committee: "Edufun", event: "F1 Face Art", venue: "PU Canteen", time: "03:00 PM â€“ 05:00 PM", coordinators: "Asit, Rudrakshi", phone: "9352607762" },
        { sno: 28, committee: "Sports", event: "Tug of War Girls (R1)", venue: "Football Ground", time: "03:00 PM â€“ 05:00 PM", coordinators: "Shubham Shekhawat", phone: "6375687833" },
        { sno: 29, committee: "Edufun", event: "Jump Together", venue: "Football Ground", time: "03:00 PM â€“ 05:00 PM", coordinators: "Vishwash, Rehan", phone: "8808167533" },
        { sno: 30, committee: "Edufun", event: "Valentine Pick", venue: "Cafegram", time: "03:00 PM â€“ 05:00 PM", coordinators: "Divyanshi, Shreekala", phone: "7597396227" },
        { sno: 31, committee: "Edufun", event: "Music Video Making", venue: "Cafegram", time: "03:00 PM â€“ 05:00 PM", coordinators: "Prince, Avni", phone: "7727945904" },
        { sno: 32, committee: "Edufun", event: "4-Legged Pentathlon", venue: "Football Ground", time: "03:00 PM â€“ 05:00 PM", coordinators: "Manav, Nikhil, Dakshina", phone: "6376755155" },
        { sno: 33, committee: "â€“", event: "Bstring Band Live", venue: "Trackside Stage, Porch Area", time: "04:00 PM â€“ 06:00 PM", coordinators: "Suhani Agarwal", phone: "8448827288" },
        { sno: 34, committee: "Cultural", event: "Prom", venue: "Power Stop Park Stage, CP", time: "04:00 PM â€“ 06:00 PM", coordinators: "Shreyansh, Yati", phone: "9352607762" },
        { sno: 35, committee: "â€“", event: "Shalmali Kholgade Live", venue: "Lakshya Grand Arena Stage", time: "07:30 PM onwards", coordinators: "Pranjal Yadav", phone: "â€“" },
        { sno: 36, committee: "â€“", event: "After Party DJ", venue: "Trackside Stage, Porch Area", time: "10:30 PM onwards", coordinators: "Pranjal Yadav", phone: "â€“" }
    ],
    day4: [
        { sno: 1, committee: "â€“", event: "Student Arrival", venue: "â€“", time: "10:00 AM â€“ 12:00 PM", coordinators: "â€“", phone: "â€“" },
        { sno: 2, committee: "â€“", event: "Student Check-in Procedure", venue: "â€“", time: "10:00 AM â€“ 12:00 PM", coordinators: "â€“", phone: "â€“" },
        { sno: 3, committee: "â€“", event: "College Bus Arrival", venue: "â€“", time: "11:00 AM", coordinators: "â€“", phone: "â€“" },
        { sno: 4, committee: "E-Sports", event: "Valorant (PC)", venue: "Lab 342, 347, 348", time: "11:00 AM â€“ 05:00 PM", coordinators: "Sparsh Dhamotiya", phone: "6377930321" },
        { sno: 5, committee: "Sports", event: "Kabaddi Boys (R2+3)", venue: "Kabaddi Court", time: "11:00 AM â€“ 05:00 PM", coordinators: "Bhavesh, Irfan, Himanshu", phone: "7412984703, 9358560159, 9799513799" },
        { sno: 6, committee: "Sports", event: "Badminton Doubles Mix (R2+3)", venue: "Badminton Court", time: "11:00 AM â€“ 05:00 PM", coordinators: "Adhyan, Yashveer", phone: "8252321290, 9024761872" },
        { sno: 7, committee: "Sports", event: "Lawn Tennis Mix (R2+3)", venue: "Tennis Court", time: "11:00 AM â€“ 05:00 PM", coordinators: "Nischal", phone: "8003973197" },
        { sno: 8, committee: "Sports", event: "Squats (Girls)", venue: "At Gym", time: "11:00 AM â€“ 05:00 PM", coordinators: "Vijay, Rajat", phone: "6375687833, 9510982522" },
        { sno: 9, committee: "Sports", event: "Box Cricket Girls (R2+3)", venue: "Football Ground", time: "11:00 AM â€“ 05:00 PM", coordinators: "Sandeep Bhargav", phone: "8209375959" },
        { sno: 10, committee: "Sports", event: "Arm Wrestling (Girls)", venue: "In front of Fitness Studio", time: "11:00 AM â€“ 02:00 PM", coordinators: "Pranjal Srivastava, Prayag", phone: "8808167533, 8949185419" },
        { sno: 11, committee: "Sports", event: "400m Relay Race (Both)", venue: "Cricket Ground", time: "11:00 AM â€“ 02:00 PM", coordinators: "Raghvendra, Nischal, Ravindra", phone: "8949684334, 8003973197, 9521534382" },
        { sno: 12, committee: "Sports", event: "Yoga Star (Mix)", venue: "Football Ground â€“ Yoga Room", time: "11:00 AM â€“ 01:00 PM", coordinators: "Chitransh, Madhav", phone: "9521658016, 6263518453" },
        { sno: 13, committee: "Sports", event: "Tug of War Boys (R2+3)", venue: "Football Ground", time: "11:00 AM â€“ 01:00 PM", coordinators: "Shubham Shekhawat, Chaitanya", phone: "9352607762, 9084780057" },
        { sno: 14, committee: "Cultural", event: "Folk Dance", venue: "Trackside Stage, Porch Area", time: "11:00 AM â€“ 01:00 PM", coordinators: "Shreyansh, Anwesha, Yati", phone: "9137441085, 7597396227, 7727945904" },
        { sno: 15, committee: "Cultural", event: "Freeze Snap", venue: "Ground Floor Seminar Hall", time: "11:00 AM â€“ 01:00 PM", coordinators: "Riddhi, Rishabh Tater, Yash", phone: "7409933055, 9352609423, 6376755155" },
        { sno: 16, committee: "Edufun", event: "Build Your F1 Beast", venue: "Power Stop Park Stage, CP", time: "11:00 AM â€“ 01:00 PM", coordinators: "Shreekala, Manav", phone: "9558786799, 8233441107" },
        { sno: 17, committee: "Edufun", event: "Create Your Outfit", venue: "Cafegram", time: "11:00 AM â€“ 01:00 PM", coordinators: "Divyanshi, Avni", phone: "8769634401, 9558786799" },
        { sno: 18, committee: "Edufun", event: "Flash Grab", venue: "New Canteen", time: "11:00 AM â€“ 01:00 PM", coordinators: "Rehan, Vishwash", phone: "6354091137, 9380609469" },
        { sno: 19, committee: "Edufun", event: "Kite Carnival", venue: "Football Ground", time: "11:00 AM â€“ 01:00 PM", coordinators: "Nikhil, Dakshina", phone: "9929697343, 9425926659" },
        { sno: 20, committee: "Sports", event: "Yoga Asana (Mix)", venue: "Football Ground â€“ Yoga Room", time: "01:00 PM â€“ 03:00 PM", coordinators: "Chitransh, Madhav", phone: "9521658016, 6263518453" },
        { sno: 21, committee: "Sports", event: "Tug of War Girls (R2+3)", venue: "Football Ground", time: "01:00 PM â€“ 03:00 PM", coordinators: "Shubham Shekhawat", phone: "9352607762" },
        { sno: 22, committee: "Cultural", event: "Rap Battle", venue: "Trackside Stage, Porch Area", time: "01:00 PM â€“ 03:00 PM", coordinators: "Rishabh, Charming, Riddhi", phone: "9352609423, 9057490975, 7409933055" },
        { sno: 23, committee: "Cultural", event: "Monologue", venue: "Ground Floor Seminar Hall", time: "01:00 PM â€“ 03:00 PM", coordinators: "Shreyansh, Yati", phone: "9137441085, 7727945904" },
        { sno: 24, committee: "Edufun", event: "Pull-O-Bus", venue: "Gate No. 4", time: "01:00 PM â€“ 03:00 PM", coordinators: "Nikhil, Asit, Rehan", phone: "9929697343, 8448827288, 6354091137" },
        { sno: 25, committee: "Edufun", event: "Fest Vlog Challenge", venue: "Cafegram", time: "01:00 PM â€“ 03:00 PM", coordinators: "Chaitanya, Avni", phone: "9660682505, 9119207340" },
        { sno: 26, committee: "Edufun", event: "Who Knows Who", venue: "Power Stop Park Stage, CP", time: "01:00 PM â€“ 03:00 PM", coordinators: "Shreekala, Manav", phone: "9558786799, 8233441107" },
        { sno: 27, committee: "Edufun", event: "Twisted Lemon Spoon Race", venue: "Football Ground", time: "01:00 PM â€“ 03:00 PM", coordinators: "Vishwash, Dakshina", phone: "9380609469, 9425926659" },
        { sno: 28, committee: "Cultural", event: "Techno Group Dance", venue: "Trackside Stage, Porch Area", time: "03:00 PM â€“ 05:00 PM", coordinators: "Yati, Anwesha, Yash", phone: "7727945904, 7597396227, 6376755155" },
        { sno: 29, committee: "Edufun", event: "Tag", venue: "Football Ground", time: "03:00 PM â€“ 05:00 PM", coordinators: "Manav, Rudrakshi", phone: "8233441107, 6350667131" },
        { sno: 30, committee: "Edufun", event: "Level Up : Human Edition", venue: "Power Stop Park Stage, CP", time: "03:00 PM â€“ 05:00 PM", coordinators: "Nikhil, Vishwash, Asit, Rehan", phone: "9929697343, 9380609469, 8448827288, 6354091137" },
        { sno: 31, committee: "â€“", event: "Armaan Malik Live", venue: "Lakshya Grand Arena Stage", time: "07:30 PM onwards", coordinators: "Uma Todi", phone: "â€“" },
        { sno: 32, committee: "â€“", event: "Lakshya 2026 Closing Ceremony", venue: "Lakshya Grand Arena Stage", time: "10:00 PM onwards", coordinators: "Uma Todi", phone: "â€“" }
    ]
};

// Current State
let currentDay = 'day0';
let filterState = {
    search: '',
    committee: 'all',
    timeOfDay: 'all'
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initFilters();
    renderDay(currentDay);
});

function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all
            tabs.forEach(t => t.classList.remove('active'));
            // Add to clicked
            tab.classList.add('active');

            const targetDay = tab.dataset.day;
            currentDay = targetDay;
            renderDay(targetDay);
        });
    });
}

function renderDay(day) {
    const contentContainer = document.getElementById('day-content');
    const allEvents = LAKSHYA_EVENTS[day];

    if (!allEvents || allEvents.length === 0) {
        contentContainer.innerHTML = `
            <div class="empty-state">
                <h3>No events scheduled</h3>
                <p>Check back later for updates!</p>
            </div>
        `;
        updateEventCount(0, 0);
        return;
    }

    // Apply filters
    const filteredEvents = applyFilters(allEvents);

    // Update event count
    updateEventCount(filteredEvents.length, allEvents.length);

    // Get day number for display
    const dayNumber = day.replace('day', '');
    const dayNames = ['Day 0', 'Day 1', 'Day 2', 'Day 3', 'Day 4'];

    if (filteredEvents.length === 0) {
        contentContainer.innerHTML = `
            <div class="day-header">
                <h2>${dayNames[dayNumber]} Event Schedule</h2>
            </div>
            <div class="empty-state">
                <h3>No events match your filters</h3>
                <p>Try adjusting your search or filter criteria</p>
            </div>
        `;
        return;
    }

    contentContainer.innerHTML = `
        <div class="day-header">
            <h2>${dayNames[dayNumber]} Event Schedule</h2>
        </div>
        <div class="event-table-wrapper">
            <table class="event-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Committee</th>
                        <th>Event</th>
                        <th>Venue</th>
                        <th>Time</th>
                        <th>Coordinator(s)</th>
                        <th>Phone No.</th>
                    </tr>
                </thead>
                <tbody>
                    ${filteredEvents.map(event => createEventRow(event)).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function createEventRow(event) {
    // Determine committee badge class
    let badgeClass = '';
    const committee = event.committee.toLowerCase();
    if (committee.includes('sport')) badgeClass = 'sports';
    else if (committee.includes('e-sport') || committee.includes('esport')) badgeClass = 'esports';
    else if (committee.includes('cultural')) badgeClass = 'cultural';
    else if (committee.includes('edufun')) badgeClass = 'edufun';

    const committeeDisplay = badgeClass
        ? `<span class="committee-badge ${badgeClass}">${event.committee}</span>`
        : event.committee;

    return `
        <tr>
            <td>${event.sno}</td>
            <td>${committeeDisplay}</td>
            <td>${event.event}</td>
            <td>${event.venue}</td>
            <td>${event.time}</td>
            <td>${event.coordinators}</td>
            <td>${event.phone}</td>
        </tr>
    `;
}


// Initialize filter toggle for mobile
function initFilterToggle() {
    const toggleBtn = document.getElementById('filter-toggle');
    const filterSection = document.getElementById('filter-section');
    const toggleText = toggleBtn?.querySelector('.toggle-text');
    
    if (!toggleBtn || !filterSection) return;
    
    toggleBtn.addEventListener('click', () => {
        const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
            toggleBtn.setAttribute('aria-expanded', 'false');
            filterSection.classList.remove('expanded');
            if (toggleText) toggleText.textContent = 'Show Filters';
        } else {
            toggleBtn.setAttribute('aria-expanded', 'true');
            filterSection.classList.add('expanded');
            if (toggleText) toggleText.textContent = 'Hide Filters';
        }
    });
}

// Update active filter count badge
function updateActiveFilterCount() {
    const countBadge = document.getElementById('active-filter-count');
    if (!countBadge) return;
    
    let activeCount = 0;
    
    // Count active filters
    if (filterState.search) activeCount++;
    if (filterState.committee !== 'all') activeCount++;
    if (filterState.timeOfDay !== 'all') activeCount++;
    
    if (activeCount > 0) {
        countBadge.textContent = activeCount.toString();
    } else {
        countBadge.textContent = '';
    }
}
// Filter Initialization
function initFilters() {
    const searchInput = document.getElementById('event-search');
    const committeeButtons = document.querySelectorAll('[data-committee]');
    const timeButtons = document.querySelectorAll('[data-time]');

    // Search input listener
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterState.search = e.target.value.toLowerCase();
            renderDay(currentDay);
        });
    }

    // Committee filter buttons
    committeeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            committeeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterState.committee = btn.dataset.committee;
            renderDay(currentDay);
        });
    });

    // Time of day filter buttons
    timeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            timeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterState.timeOfDay = btn.dataset.time;
            renderDay(currentDay);
        });
    });
}


// Parse event time and check if it has passed
function parseEventEndTime(day, timeString) {
    try {
        // Handle "onwards" events - assume they end at 11:59 PM
        if (timeString.toLowerCase().includes('onwards')) {
            const match = timeString.match(/(\d{1,2}:\d{2}\s*[AP]M)/i);
            if (match) {
                const dateStr = LAKSHYA_DATES[day];
                return new Date(`${dateStr} 11:59 PM`);
            }
        }

        // Extract end time from formats like "11:00 AM  03:00 PM"
        const endTimeMatch = timeString.match(/\s*(\d{1,2}:\d{2}\s*[AP]M)/i);
        if (!endTimeMatch) {
            // Single time format, treat as end time
            const singleMatch = timeString.match(/(\d{1,2}:\d{2}\s*[AP]M)/i);
            if (singleMatch) {
                const dateStr = LAKSHYA_DATES[day];
                return new Date(`${dateStr} ${singleMatch[1]}`);
            }
            return null;
        }

        const dateStr = LAKSHYA_DATES[day];
        const timeStr = endTimeMatch[1];
        return new Date(`${dateStr} ${timeStr}`);
    } catch (error) {
        console.error('Error parsing time:', error);
        return null;
    }
}

function isEventPast(day, timeString) {
    const eventEndTime = parseEventEndTime(day, timeString);
    if (!eventEndTime || isNaN(eventEndTime.getTime())) {
        return false; // Keep event if can't parse time
    }

    const now = new Date();
    return now > eventEndTime;
}
// Apply all filters to events
function applyFilters(events) {
    return events.filter(event => {
        // Search filter
        if (filterState.search) {
            const searchLower = filterState.search;
            const matchesSearch =
                event.event.toLowerCase().includes(searchLower) ||
                event.coordinators.toLowerCase().includes(searchLower) ||
                event.venue.toLowerCase().includes(searchLower) ||
                event.committee.toLowerCase().includes(searchLower);

            if (!matchesSearch) return false;
        }

        // Committee filter
        if (filterState.committee !== 'all') {
            const committee = event.committee.toLowerCase();
            const filterValue = filterState.committee;

            if (filterValue === 'sports' && !committee.includes('sport')) return false;
            if (filterValue === 'e-sports' && !(committee.includes('e-sport') || committee.includes('esport'))) return false;
            if (filterValue === 'cultural' && !committee.includes('cultural')) return false;
            if (filterValue === 'edufun' && !committee.includes('edufun')) return false;
        }

        // Time of day filter
        if (filterState.timeOfDay !== 'all') {
            const timeStr = event.time.toLowerCase();
            const filterValue = filterState.timeOfDay;

            if (filterValue === 'morning') {
                // Morning: before 12 PM
                if (!timeStr.includes('10:00 am') && !timeStr.includes('11:00 am') && !timeStr.includes('12:00 pm')) {
                    return false;
                }
            } else if (filterValue === 'afternoon') {
                // Afternoon: 12 PM - 5 PM
                const afternoonTimes = ['12:00 pm', '01:00 pm', '02:00 pm', '03:00 pm', '04:00 pm', '05:00 pm'];
                const matchesAfternoon = afternoonTimes.some(time => timeStr.includes(time));
                if (!matchesAfternoon) return false;
            } else if (filterValue === 'evening') {
                // Evening: after 5 PM
                const eveningTimes = ['06:00 pm', '07:00 pm', '08:00 pm', '09:00 pm', '10:00 pm', '10:30 pm', 'onwards'];
                const matchesEvening = eveningTimes.some(time => timeStr.includes(time));
                if (!matchesEvening) return false;
            }
        }

        // Real-time filter - hide events that have already passed
        if (isEventPast(currentDay, event.time)) {
            return false;
        }

        return true;
    });
}

// Update event count display
function updateEventCount(showing, total) {
    const countElement = document.getElementById('event-count');
    if (countElement) {
        if (showing === total) {
            countElement.textContent = `Events: ${total} total`;
        } else {
            countElement.textContent = `Events: ${showing} showing  ${total} total`;
        }
    }
}


// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize tabs
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentDay = tab.dataset.day;
            renderDay(currentDay);
        });
    });

    // Initialize filters
    initFilters();
    
    // Initialize filter toggle for mobile
    initFilterToggle();
    
    // Initial render
    renderDay(currentDay);
    
    // Initial filter count
    updateActiveFilterCount();
});

