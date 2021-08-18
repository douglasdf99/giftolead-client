import paginas from "@/paginas";

export default {
  pages: {
    key: "title",
    data: [
        ...paginas.pages
    ]
  },
  files: {
    key:"file_name",
    data: [
      {file_name: "Joe's CV", from:"Stacy Watson", file_ext:"doc", size:"1.7 mb" },
      {file_name: "Passport Image", from:"Ben Sinitiere", file_ext:"jpg", size:" 52 kb" },
      {file_name: "Questions", from:"Charleen Patti", file_ext:"doc", size:"1.5 gb" },
      {file_name: "Parenting Guide", from:"Doyle Blatteau", file_ext:"doc", size:"2.3 mb" },
      {file_name: "Class Notes", from:"Gwen Greenlow", file_ext:"doc", size:" 30 kb" },
      {file_name: "Class Attendance", from:"Tom Alred", file_ext:"xls", size:"52 mb" },
      {file_name: "Company Salary", from:"Nellie Dezan", file_ext:"xls", size:"29 mb" },
      {file_name: "Company Logo", from:"Steve Sheldon", file_ext:"jpg", size:"1.3 mb" },
      {file_name: "Crime Rates", from:"Sherlock Holmes", file_ext:"xls", size:"37 kb" },
      {file_name: "Ulysses", from:"Theresia Wrenne", file_ext:"pdf", size:"7.2 mb" },
      {file_name: "War and Peace", from:"Goldie Highnote", file_ext:"pdf", size:"10.5 mb" },
      {file_name: "Vedas", from:"Ajay Patel", file_ext:"pdf", size:"8.3 mb" },
      {file_name: "The Trial", from:"Sirena Linkert", file_ext:"pdf", size:"1.5 mb" },
    ]
  },
  contacts: {
    key:"name",
    data: [
      {img: require("@/assets/images/portrait/small/avatar-s-4.jpg"), name: "Rena Brant", email: "nephrod@preany.co.uk", time: "21/05/2019"},
      {img: require("@/assets/images/portrait/small/avatar-s-2.jpg"), name: "Mariano Packard", email: "seek@sparaxis.org", time: "14/01/2018"},
      {img: require("@/assets/images/portrait/small/avatar-s-24.jpg"), name: "Risa Montufar", email: "vagary@unblist.org", time: "10/08/2019"},
      {img: require("@/assets/images/portrait/small/avatar-s-15.jpg"), name: "Maragaret Cimo", email: "designed@insanely.net", time: "01/12/2019"},
      {img: require("@/assets/images/portrait/small/avatar-s-7.jpg"), name: "Jona Prattis", email: "unwieldable@unblist.org", time: "21/05/2019"},
      {img: require("@/assets/images/portrait/small/avatar-s-5.jpg"), name: "Edmond Chicon", email: "museist@anaphyte.co.uk", time: "15/11/2019"},
      {img: require("@/assets/images/portrait/small/avatar-s-25.jpg"), name: "Abbey Darden", email: "astema@defectively.co.uk", time: "07/05/2019"},
      {img: require("@/assets/images/portrait/small/avatar-s-10.jpg"), name: "Seema Moallankamp", email: "fernando@storkish.co.uk", time: "13/08/2017"},
      {img: require("@/assets/images/portrait/small/avatar-s-2.jpg"), name: "Charleen Warmington", email: "furphy@cannibal.net", time: "11/08/1891"},
      {img: require("@/assets/images/portrait/small/avatar-s-25.jpg"), name: "Geri Linch", email: "insignia@markab.org", time: "18/01/2015"},
      {img: require("@/assets/images/portrait/small/avatar-s-23.jpg"), name: "Shellie Muster", email: "maxillary@equalize.co.uk", time: "26/07/2019"},
      {img: require("@/assets/images/portrait/small/avatar-s-20.jpg"), name: "Jesenia Vanbramer", email: "hypotony@phonetist.net", time: "12/09/2017"},
      {img: require("@/assets/images/portrait/small/avatar-s-23.jpg"), name: "Mardell Channey", email: "peseta@myrica.com", time: "11/11/2019"},
    ]
  },
}
