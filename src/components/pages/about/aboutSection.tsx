'use client';

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  icon: string;
}

interface Education {
  degree: string;
  school: string;
  period: string;
  icon: string;
}

const experiences: Experience[] = [
  {
    title: 'Senior Full Stack Developer',
    company: 'Tech Company Inc.',
    period: '2022 - Present',
    description: 'Lead development of enterprise applications using React, Node.js, and AWS. Mentor junior developers and architect scalable solutions.',
    icon: '💼',
  },
  {
    title: 'Full Stack Developer',
    company: 'Digital Agency',
    period: '2020 - 2022',
    description: 'Built and maintained client websites and web applications. Implemented CI/CD pipelines and improved application performance.',
    icon: '🚀',
  },
  {
    title: 'Frontend Developer',
    company: 'Startup Co.',
    period: '2018 - 2020',
    description: 'Developed responsive user interfaces and collaborated with designers. Implemented modern frontend best practices.',
    icon: '💻',
  },
];

const education: Education[] = [
  {
    degree: 'Master of Computer Science',
    school: 'University of Technology',
    period: '2016 - 2018',
    icon: '🎓',
  },
  {
    degree: 'Bachelor of Software Engineering',
    school: 'Tech Institute',
    period: '2012 - 2016',
    icon: '📚',
  },
];

const stats = [
  { label: 'Years Experience', value: '5+', icon: '⏳' },
  { label: 'Projects Completed', value: '50+', icon: '✅' },
  { label: 'Happy Clients', value: '30+', icon: '😊' },
  { label: 'Code Commits', value: '10K+', icon: '💻' },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative py-20 px-6 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-background opacity-20" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            <span className="gradient-text">About Me</span>
          </h2>
          <p className="text-lg md:text-xl text-[var(--text-tertiary)] max-w-2xl mx-auto">
            Passionate developer with a mission to create impactful digital experiences
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="glass-effect rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 hover:border-[var(--accent-primary)] animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-[var(--text-tertiary)]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* About Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* About Text */}
          <div className="space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold gradient-text">
              Who Am I?
            </h3>
            <div className="space-y-4 text-[var(--text-secondary)]">
              <p>
                I&apos;m a passionate full-stack developer with over 5 years of experience
                building web applications that solve real-world problems. I love turning
                complex challenges into simple, beautiful, and intuitive solutions.
              </p>
              <p>
                My expertise spans across modern web technologies including React, Node.js,
                TypeScript, and cloud platforms. I&apos;m constantly learning and staying up-to-date
                with the latest industry trends and best practices.
              </p>
              <p>
                When I&apos;m not coding, you can find me contributing to open-source projects,
                writing technical articles, or exploring new technologies. I believe in
                writing clean, maintainable code and creating exceptional user experiences.
              </p>
            </div>

            {/* Download Resume */}
            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-semibold transition-all duration-300 hover:scale-105 glow-effect"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Resume
            </a>
          </div>

          {/* Profile Image Placeholder */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="w-80 h-80 rounded-2xl bg-gradient-to-br from-white to-gray-400 p-1 animate-float">
                <div className="w-full h-full rounded-2xl bg-[var(--bg-secondary)] flex items-center justify-center text-8xl">
                  👨‍💻
                </div>
              </div>
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-20 h-20 glass-effect rounded-xl flex items-center justify-center text-3xl animate-float" style={{ animationDelay: '0.5s' }}>
                ⚛️
              </div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 glass-effect rounded-xl flex items-center justify-center text-3xl animate-float" style={{ animationDelay: '1s' }}>
                🚀
              </div>
            </div>
          </div>
        </div>

        {/* Experience Timeline */}
        <div className="mb-20">
          <h3 className="text-2xl md:text-3xl font-bold gradient-text mb-10 text-center">
            Work Experience
          </h3>
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-white via-gray-400 to-gray-600" />

            {/* Timeline Items */}
            <div className="space-y-12">
              {experiences.map((exp, index) => (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 -ml-2 rounded-full bg-white glow-effect" />

                  {/* Content */}
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'} pl-20 md:pl-0`}>
                    <div
                      className="glass-effect rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:border-[var(--accent-primary)] animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.2}s`, opacity: 0 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{exp.icon}</span>
                        <div>
                          <h4 className="text-lg font-bold text-[var(--text-primary)]">
                            {exp.title}
                          </h4>
                          <p className="text-sm font-semibold text-[var(--accent-primary)]">
                            {exp.company}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-[var(--text-tertiary)] mb-3">{exp.period}</p>
                      <p className="text-sm text-[var(--text-secondary)]">{exp.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Education */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold gradient-text mb-10 text-center">
            Education
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {education.map((edu, index) => (
              <div
                key={index}
                className="glass-effect rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:border-[var(--accent-primary)] animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s`, opacity: 0 }}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-white to-gray-400 flex items-center justify-center text-2xl">
                    {edu.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[var(--text-primary)]">
                      {edu.degree}
                    </h4>
                    <p className="text-sm text-[var(--text-tertiary)]">{edu.period}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-[var(--accent-primary)]">
                  {edu.school}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
