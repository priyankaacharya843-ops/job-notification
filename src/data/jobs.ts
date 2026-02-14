import type { Job } from "../types/job";

const companies = [
  "Infosys", "TCS", "Wipro", "Accenture", "Capgemini", "Cognizant",
  "IBM", "Oracle", "SAP", "Dell",
  "Amazon", "Flipkart", "Swiggy", "Razorpay", "PhonePe", "Paytm",
  "Zoho", "Freshworks", "Juspay", "CRED",
  "Unacademy", "Byju's", "Meesho", "ShareChat", "Dream11", "Policybazaar",
  "Licious", "Dunzo", "Urban Company", "NoBroker",
  "Postman", "BrowserStack", "Thoughtworks", "HashedIn", "Gojek",
];

const locations = [
  "Bangalore", "Hyderabad", "Mumbai", "Chennai", "Pune", "Gurgaon", "Noida",
  "Kolkata", "Ahmedabad", "Remote", "India",
];

const roles = [
  "SDE Intern", "Graduate Engineer Trainee", "Junior Backend Developer",
  "Frontend Intern", "QA Intern", "Data Analyst Intern",
  "Java Developer (0-1)", "Python Developer (Fresher)", "React Developer (1-3)",
  "Full Stack Developer (Fresher)", "Backend Intern", "DevOps Intern",
  "Mobile Developer (0-1)", "Software Engineer Trainee", "UI Developer (Fresher)",
];

const salaryRanges = [
  "₹15k–₹40k/month Internship", "3–5 LPA", "6–10 LPA", "10–18 LPA", "5–8 LPA", "8–12 LPA",
];

const skillSets: string[][] = [
  ["Java", "Spring Boot", "SQL"],
  ["Python", "Django", "REST APIs"],
  ["React", "JavaScript", "HTML", "CSS"],
  ["Node.js", "MongoDB", "Express"],
  ["Java", "Hibernate", "MySQL"],
  ["Python", "Pandas", "SQL"],
  ["C++", "Data Structures", "Algorithms"],
  ["React", "TypeScript", "Redux"],
  ["Selenium", "Java", "Test Automation"],
  ["SQL", "Excel", "Tableau"],
  ["Kotlin", "Android", "REST"],
  ["Go", "Kubernetes", "Docker"],
  ["Angular", "TypeScript", "RxJS"],
  ["AWS", "Python", "Lambda"],
];

const descriptions = [
  "Join our engineering team to build scalable systems. You will work on real projects alongside senior developers and get mentorship. We value curiosity and ownership.",
  "We are looking for enthusiastic freshers to contribute to our product development. You will be part of an agile team and learn industry best practices.",
  "This role offers hands-on experience in building and maintaining backend services. You will work with modern tech stack and participate in code reviews.",
  "Work on customer-facing features and internal tools. We provide a supportive environment for learning and growth. Prior internship experience is a plus.",
  "You will be responsible for writing clean code, unit tests, and collaborating with designers and product managers. Strong problem-solving skills required.",
  "Join our platform team to build APIs and services used by millions. We follow test-driven development and continuous integration practices.",
  "Ideal for candidates passionate about software development. You will get exposure to full product lifecycle and work with cross-functional teams.",
  "We are building the next generation of our product. You will contribute to design discussions and implement features end to end with guidance from seniors.",
];

function pick<T>(arr: T[], index: number): T {
  return arr[index % arr.length];
}

export function buildJobs(): Job[] {
  const jobs: Job[] = [];
  const modes = ["Remote", "Hybrid", "Onsite"] as const;
  const experiences = ["Fresher", "0-1", "1-3", "3-5"] as const;
  const sources = ["LinkedIn", "Naukri", "Indeed"] as const;

  for (let i = 0; i < 60; i++) {
    jobs.push({
      id: `job-${i + 1}`,
      title: pick(roles, i),
      company: pick(companies, i),
      location: pick(locations, i),
      mode: pick(modes, i),
      experience: pick(experiences, i),
      skills: [...skillSets[i % skillSets.length]],
      source: pick(sources, i),
      postedDaysAgo: i % 11,
      salaryRange: pick(salaryRanges, i),
      applyUrl: `https://careers.${pick(companies, i).toLowerCase().replace(/[^a-z0-9]/g, "")}.com/jobs/${i + 1}`,
      description: pick(descriptions, i),
    });
  }

  return jobs;
}

export const JOBS: Job[] = buildJobs();
