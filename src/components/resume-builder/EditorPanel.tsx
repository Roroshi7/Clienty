"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Plus, Trash2, Pencil, Wand2 } from "lucide-react"
import { EditorPanelProps, Resume } from "@/types/resume"

const resumeSchema = z.object({
  personalInfo: z.object({
    name: z.string().min(1, "Name is required"),
    title: z.string().min(1, "Title is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(1, "Phone is required"),
    location: z.string().optional(),
    github: z.string().optional(),
  }),
  experience: z.array(
    z.object({
      title: z.string().min(1, "Title is required"),
      company: z.string().min(1, "Company is required"),
      duration: z.string().min(1, "Duration is required"),
      description: z.array(z.string()),
    })
  ),
  education: z.array(
    z.object({
      degree: z.string().min(1, "Degree is required"),
      institution: z.string().min(1, "Institution is required"),
      duration: z.string().min(1, "Duration is required"),
      gpa: z.string().optional(),
      relevantCoursework: z.string().optional(),
    })
  ),
  skills: z.array(z.string()),
  projects: z.array(
    z.object({
      name: z.string().min(1, "Project name is required"),
      description: z.array(z.string()),
      duration: z.string().optional(),
      technologies: z.array(z.string()).optional(),
      achievements: z.array(z.string()).optional(),
    })
  ).optional(),
  activities: z.array(
    z.object({
      name: z.string().min(1, "Activity name is required"),
      role: z.string().min(1, "Role is required"),
      duration: z.string().min(1, "Duration is required"),
      description: z.array(z.string()).optional(),
    })
  ).optional(),
  languages: z.string().optional(),
  certifications: z.string().optional(),
  awards: z.string().optional(),
})

// Add Gemini API function
const generateBulletPoints = async (description: string, type: 'experience' | 'project') => {
  try {
    const response = await fetch('/api/generate-bullets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        description,
        type,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate bullet points');
    }
    
    const data = await response.json();
    return data.bulletPoints;
  } catch (error) {
    console.error('Error generating bullet points:', error);
    return [];
  }
}

export function EditorPanel({ resume, onUpdate }: EditorPanelProps) {
  const [newSkill, setNewSkill] = useState("")
  const [newBulletPoint, setNewBulletPoint] = useState("")
  const [editingExperience, setEditingExperience] = useState<number | null>(null)
  const [editingEducation, setEditingEducation] = useState<number | null>(null)
  const [editingProject, setEditingProject] = useState<number | null>(null)
  const [isGeneratingBullets, setIsGeneratingBullets] = useState(false)
  const [generatedBullets, setGeneratedBullets] = useState<string[]>([])
  const [currentDescription, setCurrentDescription] = useState("")
  const [currentType, setCurrentType] = useState<'experience' | 'project'>('experience')
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    duration: "",
    description: [] as string[],
    startDate: null as Date | null,
    endDate: null as Date | null,
  })
  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    duration: "",
    gpa: "",
    relevantCoursework: "",
    startDate: null as Date | null,
    endDate: null as Date | null,
  })
  const [newProject, setNewProject] = useState({
    name: "",
    description: [] as string[],
    duration: "",
    technologies: [] as string[],
    startDate: null as Date | null,
    endDate: null as Date | null,
  })
  const [newActivity, setNewActivity] = useState({
    name: "",
    role: "",
    duration: "",
    description: [] as string[],
    startDate: null as Date | null,
    endDate: null as Date | null,
  })
  const [newTechnology, setNewTechnology] = useState("")
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Resume>({
    resolver: zodResolver(resumeSchema),
    defaultValues: resume,
  })

  // Reset form when resume prop changes
  React.useEffect(() => {
    reset(resume)
  }, [resume, reset])

  const onSubmit = (data: Resume) => {
    // Create a complete resume object with all fields
    const updatedResume = {
      personalInfo: {
        ...data.personalInfo,
      },
      experience: data.experience || [],
      education: data.education || [],
      skills: data.skills || [],
      projects: data.projects || [],
      activities: data.activities || [],
      languages: data.languages,
      certifications: data.certifications,
      awards: data.awards,
    };
    
    console.log('Submitting updated resume:', updatedResume);
    onUpdate(updatedResume);
  }

  // Update form values when individual sections are modified
  const updateFormAndState = (newData: Partial<Resume>) => {
    const updatedResume = {
      ...resume,
      ...newData,
    };
    
    // Update form values
    Object.entries(newData).forEach(([key, value]) => {
      setValue(key as keyof Resume, value);
    });
    
    // Update parent state
    onUpdate(updatedResume);
  }

  const addSkill = () => {
    if (newSkill.trim()) {
      const updatedSkills = [...(resume.skills || []), newSkill.trim()];
      updateFormAndState({ skills: updatedSkills });
      setNewSkill("");
    }
  }

  const removeSkill = (index: number) => {
    const updatedSkills = [...(resume.skills || [])];
    updatedSkills.splice(index, 1);
    updateFormAndState({ skills: updatedSkills });
  }

  const addExperience = () => {
    if (
      newExperience.title &&
      newExperience.company &&
      newExperience.duration
    ) {
      const updatedExperience = [...(resume.experience || []), {
        ...newExperience,
        description: newExperience.description.filter(line => line.trim())
      }];
      updateFormAndState({ experience: updatedExperience });
      setNewExperience({
        title: "",
        company: "",
        duration: "",
        description: [],
        startDate: null,
        endDate: null,
      });
    }
  }

  const removeExperience = (index: number) => {
    const updatedExperience = [...(resume.experience || [])];
    updatedExperience.splice(index, 1);
    updateFormAndState({ experience: updatedExperience });
  }

  const addEducation = () => {
    if (
      newEducation.degree &&
      newEducation.institution &&
      newEducation.duration
    ) {
      const updatedEducation = [...(resume.education || []), {
        ...newEducation,
        gpa: newEducation.gpa || undefined,
        relevantCoursework: newEducation.relevantCoursework || undefined,
      }];
      updateFormAndState({ education: updatedEducation });
      setNewEducation({
        degree: "",
        institution: "",
        duration: "",
        gpa: "",
        relevantCoursework: "",
        startDate: null,
        endDate: null,
      });
    }
  }

  const removeEducation = (index: number) => {
    const updatedEducation = [...(resume.education || [])];
    updatedEducation.splice(index, 1);
    updateFormAndState({ education: updatedEducation });
  }

  const addProject = () => {
    if (newProject.name && newProject.description.length > 0) {
      const updatedProjects = [...(resume.projects || []), {
        ...newProject,
        description: newProject.description.filter(line => line.trim()),
        technologies: newProject.technologies.length > 0 ? newProject.technologies : undefined,
      }];
      updateFormAndState({ projects: updatedProjects });
      setNewProject({
        name: "",
        description: [],
        duration: "",
        technologies: [],
        startDate: null,
        endDate: null,
      });
    }
  }

  const removeProject = (index: number) => {
    const updatedProjects = [...(resume.projects || [])];
    updatedProjects.splice(index, 1);
    updateFormAndState({ projects: updatedProjects });
  }

  const addTechnology = () => {
    if (newTechnology.trim()) {
      setNewProject({
        ...newProject,
        technologies: [...newProject.technologies, newTechnology.trim()],
      })
      setNewTechnology("")
    }
  }

  const removeTechnology = (index: number) => {
    const updatedTechnologies = [...newProject.technologies]
    updatedTechnologies.splice(index, 1)
    setNewProject({ ...newProject, technologies: updatedTechnologies })
  }

  const formatDateRange = (startDate: Date | null, endDate: Date | null) => {
    if (!startDate) return ""
    const start = format(startDate, "MMM yyyy")
    const end = endDate ? format(endDate, "MMM yyyy") : "Present"
    return `${start} - ${end}`
  }

  const BulletPointInput = ({ 
    value, 
    onChange, 
    onAdd, 
    placeholder 
  }: { 
    value: string
    onChange: (value: string) => void
    onAdd: () => void
    placeholder: string 
  }) => (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-[#2a2a2a] border-[#3a3a3a]"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            onAdd()
          }
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onAdd}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )

  const DateRangeSelector = ({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
  }: {
    startDate: Date | undefined
    endDate: Date | undefined
    onStartDateChange: (date: Date | undefined) => void
    onEndDateChange: (date: Date | undefined) => void
  }) => (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              !startDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? format(startDate, "MMM yyyy") : "Start Date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={onStartDateChange}
            initialFocus
            required={false}
          />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[200px] justify-start text-left font-normal",
              !endDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {endDate ? format(endDate, "MMM yyyy") : "End Date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={onEndDateChange}
            initialFocus
            required={false}
          />
        </PopoverContent>
      </Popover>
    </div>
  )

  const handleEditExperience = (index: number) => {
    const exp = resume.experience?.[index]
    if (exp) {
      setNewExperience({
        title: exp.title,
        company: exp.company,
        duration: exp.duration,
        description: exp.description,
        startDate: null,
        endDate: null,
      })
      setEditingExperience(index)
    }
  }

  const handleEditEducation = (index: number) => {
    const edu = resume.education?.[index]
    if (edu) {
      setNewEducation({
        degree: edu.degree,
        institution: edu.institution,
        duration: edu.duration,
        gpa: edu.gpa || "",
        relevantCoursework: edu.relevantCoursework || "",
        startDate: null,
        endDate: null,
      })
      setEditingEducation(index)
    }
  }

  const handleEditProject = (index: number) => {
    const project = resume.projects?.[index]
    if (project) {
      setNewProject({
        name: project.name,
        description: project.description,
        duration: project.duration || "",
        technologies: project.technologies || [],
        startDate: null,
        endDate: null,
      })
      setEditingProject(index)
    }
  }

  const updateExperience = () => {
    if (editingExperience !== null && newExperience.title && newExperience.company && newExperience.duration) {
      const updatedExperience = [...(resume.experience || [])]
      updatedExperience[editingExperience] = {
        ...newExperience,
        description: newExperience.description.filter(line => line.trim())
      }
      updateFormAndState({ experience: updatedExperience })
      setNewExperience({
        title: "",
        company: "",
        duration: "",
        description: [],
        startDate: null,
        endDate: null,
      })
      setEditingExperience(null)
    }
  }

  const updateEducation = () => {
    if (editingEducation !== null && newEducation.degree && newEducation.institution && newEducation.duration) {
      const updatedEducation = [...(resume.education || [])]
      updatedEducation[editingEducation] = {
        ...newEducation,
        gpa: newEducation.gpa || undefined,
        relevantCoursework: newEducation.relevantCoursework || undefined,
      }
      updateFormAndState({ education: updatedEducation })
      setNewEducation({
        degree: "",
        institution: "",
        duration: "",
        gpa: "",
        relevantCoursework: "",
        startDate: null,
        endDate: null,
      })
      setEditingEducation(null)
    }
  }

  const updateProject = () => {
    if (editingProject !== null && newProject.name && newProject.description.length > 0) {
      const updatedProjects = [...(resume.projects || [])]
      updatedProjects[editingProject] = {
        ...newProject,
        description: newProject.description.filter(line => line.trim()),
        technologies: newProject.technologies.length > 0 ? newProject.technologies : undefined,
      }
      updateFormAndState({ projects: updatedProjects })
      setNewProject({
        name: "",
        description: [],
        duration: "",
        technologies: [],
        startDate: null,
        endDate: null,
      })
      setEditingProject(null)
    }
  }

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date)
    setNewExperience({
      ...newExperience,
      startDate: date || null,
      duration: date && newExperience.endDate ? formatDateRange(date, newExperience.endDate) : '',
    })
  }

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date)
    setNewExperience({
      ...newExperience,
      endDate: date || null,
      duration: newExperience.startDate && date ? formatDateRange(newExperience.startDate, date) : '',
    })
  }

  // Add function to handle bullet generation
  const handleGenerateBullets = async (description: string, type: 'experience' | 'project') => {
    setIsGeneratingBullets(true);
    setCurrentDescription(description);
    setCurrentType(type);
    
    try {
      const bullets = await generateBulletPoints(description, type);
      setGeneratedBullets(bullets);
    } catch (error) {
      console.error('Error generating bullets:', error);
    } finally {
      setIsGeneratingBullets(false);
    }
  };

  // Add function to apply generated bullets
  const applyGeneratedBullets = () => {
    if (currentType === 'experience' && editingExperience !== null) {
      setNewExperience({
        ...newExperience,
        description: generatedBullets,
      });
    } else if (currentType === 'project' && editingProject !== null) {
      setNewProject({
        ...newProject,
        description: generatedBullets,
      });
    }
    setGeneratedBullets([]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 h-[calc(100vh-64px)] overflow-y-auto px-6 py-4 w-full flex flex-col">
      <div className="flex-grow space-y-4">
        {/* Personal Information */}
        <div className="space-y-3 w-full">
          <div className="flex items-center space-x-2 mb-2">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-[#ffaa40] via-[#7D47EA] to-[#ffaa40] bg-clip-text text-transparent">Personal Information</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#7d47ea]/50 to-transparent" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Full Name</label>
              <Input
                {...register("personalInfo.name")}
                placeholder="e.g., John Doe"
                className="bg-[#1a1a1a] border-[#3a3a3a] focus:border-[#7d47ea] transition-colors h-8"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Title</label>
              <Input
                {...register("personalInfo.title")}
                placeholder="e.g., Senior Software Engineer"
                className="bg-[#1a1a1a] border-[#3a3a3a] focus:border-[#7d47ea] transition-colors h-8"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Email</label>
              <Input
                {...register("personalInfo.email")}
                placeholder="e.g., john@example.com"
                className="bg-[#1a1a1a] border-[#3a3a3a] focus:border-[#7d47ea] transition-colors h-8"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Phone</label>
              <Input
                {...register("personalInfo.phone")}
                placeholder="e.g., +1 234 567 8900"
                className="bg-[#1a1a1a] border-[#3a3a3a] focus:border-[#7d47ea] transition-colors h-8"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Location</label>
              <Input
                {...register("personalInfo.location")}
                placeholder="e.g., New York, NY"
                className="bg-[#1a1a1a] border-[#3a3a3a] focus:border-[#7d47ea] transition-colors h-8"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">GitHub URL</label>
              <Input
                {...register("personalInfo.github")}
                placeholder="e.g., https://github.com/johndoe"
                className="bg-[#1a1a1a] border-[#3a3a3a] focus:border-[#7d47ea] transition-colors h-8"
              />
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 mb-2">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-[#ffaa40] via-[#7D47EA] to-[#ffaa40] bg-clip-text text-transparent">Education</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#7d47ea]/50 to-transparent" />
          </div>
          <div className="space-y-3">
            {resume.education?.map((edu, index) => (
              <div key={index} className="p-3 border border-[#3a3a3a] rounded-lg bg-[#1a1a1a] hover:border-[#7d47ea]/50 transition-colors group">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <div className="font-medium text-white group-hover:text-[#7d47ea] transition-colors">{edu.institution}</div>
                    <div className="text-sm text-gray-400">{edu.degree}</div>
                    {edu.gpa && <div className="text-sm text-gray-400">GPA: {edu.gpa}</div>}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditEducation(index)}
                      className="h-6 w-6 text-gray-400 hover:text-white"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEducation(index)}
                      className="h-6 w-6 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-gray-400">{edu.duration}</div>
              </div>
            ))}
            
            {/* Add/Edit Education Form */}
            <div className="space-y-3 bg-[#1a1a1a] p-3 rounded-lg border border-[#3a3a3a]">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm text-gray-400">Institution</label>
                  <Input
                    value={newEducation.institution}
                    onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                    placeholder="e.g., Stanford University"
                    className="bg-[#2a2a2a] border-[#3a3a3a] focus:border-[#7d47ea] transition-colors h-8"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-400">Degree</label>
                  <Input
                    value={newEducation.degree}
                    onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                    placeholder="e.g., BS in Computer Science"
                    className="bg-[#2a2a2a] border-[#3a3a3a] focus:border-[#7d47ea] transition-colors h-8"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm text-gray-400">GPA</label>
                  <Input
                    value={newEducation.gpa}
                    onChange={(e) => setNewEducation({ ...newEducation, gpa: e.target.value })}
                    placeholder="e.g., 3.8/4.0"
                    className="bg-[#2a2a2a] border-[#3a3a3a] focus:border-[#7d47ea] transition-colors h-8"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-400">Duration</label>
                  <DateRangeSelector
                    startDate={newEducation.startDate || undefined}
                    endDate={newEducation.endDate || undefined}
                    onStartDateChange={(date) => {
                      if (date && newEducation.endDate) {
                        setNewEducation({
                          ...newEducation,
                          startDate: date,
                          duration: formatDateRange(date, newEducation.endDate),
                        })
                      }
                    }}
                    onEndDateChange={(date) => {
                      if (newEducation.startDate && date) {
                        setNewEducation({
                          ...newEducation,
                          endDate: date,
                          duration: formatDateRange(newEducation.startDate, date),
                        })
                      }
                    }}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-400">Relevant Coursework</label>
                <Input
                  value={newEducation.relevantCoursework}
                  onChange={(e) => setNewEducation({ ...newEducation, relevantCoursework: e.target.value })}
                  placeholder="e.g., Data Structures, Algorithms, Web Development"
                  className="bg-[#2a2a2a] border-[#3a3a3a] focus:border-[#7d47ea] transition-colors h-8"
                />
              </div>
              <Button
                type="button"
                onClick={editingEducation !== null ? updateEducation : addEducation}
                className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border border-[#7d47ea]/50 hover:border-[#7d47ea] transition-colors h-8"
              >
                {editingEducation !== null ? "Update Education" : "Add Education"}
              </Button>
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 mb-2">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-[#ffaa40] via-[#7D47EA] to-[#ffaa40] bg-clip-text text-transparent">Experience</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#7d47ea]/50 to-transparent" />
          </div>
          <div className="space-y-3">
            {resume.experience?.map((exp, index) => (
              <div key={index} className="p-3 border border-[#3a3a3a] rounded-lg bg-[#1a1a1a] hover:border-[#7d47ea]/50 transition-colors group">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <div className="font-medium text-white group-hover:text-[#7d47ea] transition-colors">{exp.company}</div>
                    <div className="text-sm text-gray-400 italic">{exp.title}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditExperience(index)}
                      className="h-6 w-6 text-gray-400 hover:text-white"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExperience(index)}
                      className="h-6 w-6 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-gray-400">{exp.duration}</div>
              </div>
            ))}
            
            {/* Add/Edit Experience Form */}
            <div className="space-y-3 bg-[#1a1a1a] p-3 rounded-lg border border-[#3a3a3a]">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm text-gray-400">Company</label>
                  <Input
                    value={newExperience.company}
                    onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                    placeholder="e.g., Google"
                    className="bg-[#2a2a2a] border-[#3a3a3a] focus:border-[#7d47ea] transition-colors h-8"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-400">Title</label>
                  <Input
                    value={newExperience.title}
                    onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                    placeholder="e.g., Software Engineer"
                    className="bg-[#2a2a2a] border-[#3a3a3a] focus:border-[#7d47ea] transition-colors h-8"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-400">Duration</label>
                <DateRangeSelector
                  startDate={newExperience.startDate || undefined}
                  endDate={newExperience.endDate || undefined}
                  onStartDateChange={handleStartDateChange}
                  onEndDateChange={handleEndDateChange}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-400">Description</label>
                <div className="space-y-2">
                  <Textarea
                    value={newExperience.description.join('\n')}
                    onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value.split('\n').filter(line => line.trim()) })}
                    placeholder="Enter your experience description (one point per line)"
                    className="bg-[#2a2a2a] border-[#3a3a3a] focus:border-[#7d47ea] transition-colors min-h-[60px] text-sm"
                  />
                  <Button
                    type="button"
                    onClick={() => handleGenerateBullets(newExperience.description.join('\n'), 'experience')}
                    className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border border-[#7d47ea]/50 hover:border-[#7d47ea] transition-colors h-8"
                    disabled={isGeneratingBullets}
                  >
                    {isGeneratingBullets ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⚡</span>
                        Generating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Wand2 className="h-4 w-4" />
                        Generate Bullet Points
                      </span>
                    )}
                  </Button>
                </div>
              </div>
              {generatedBullets.length > 0 && currentType === 'experience' && (
                <div className="space-y-2 p-3 bg-[#2a2a2a] rounded-lg border border-[#7d47ea]/50">
                  <h3 className="text-sm font-medium text-white">Generated Bullet Points</h3>
                  <ul className="space-y-1">
                    {generatedBullets.map((bullet, index) => (
                      <li key={index} className="text-sm text-gray-300">• {bullet}</li>
                    ))}
                  </ul>
                  <Button
                    type="button"
                    onClick={applyGeneratedBullets}
                    className="w-full bg-[#7d47ea] hover:bg-[#7d47ea]/90 text-white transition-colors h-8"
                  >
                    Apply Generated Bullets
                  </Button>
                </div>
              )}
              <Button
                type="button"
                onClick={editingExperience !== null ? updateExperience : addExperience}
                className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border border-[#7d47ea]/50 hover:border-[#7d47ea] transition-colors h-8"
              >
                {editingExperience !== null ? "Update Experience" : "Add Experience"}
              </Button>
            </div>
          </div>
        </div>

        {/* Technical Skills */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 mb-2">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-[#ffaa40] via-[#7D47EA] to-[#ffaa40] bg-clip-text text-transparent">Technical Skills</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#7d47ea]/50 to-transparent" />
          </div>
          <div className="space-y-3 bg-[#1a1a1a] p-3 rounded-lg border border-[#3a3a3a]">
            <div className="flex flex-wrap gap-2">
              {resume.skills?.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-[#2a2a2a] text-white px-2 py-1 rounded-md text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill"
                className="bg-[#2a2a2a] border-[#3a3a3a] focus:border-[#7d47ea] transition-colors h-8"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addSkill()
                  }
                }}
              />
              <Button
                type="button"
                onClick={addSkill}
                className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border border-[#7d47ea]/50 hover:border-[#7d47ea] transition-colors h-8 px-3"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 mb-2">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-[#ffaa40] via-[#7D47EA] to-[#ffaa40] bg-clip-text text-transparent">Projects</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#7d47ea]/50 to-transparent" />
          </div>
          <div className="space-y-3">
            {resume.projects?.map((project, index) => (
              <div key={index} className="p-3 border border-[#3a3a3a] rounded-lg bg-[#1a1a1a] hover:border-[#7d47ea]/50 transition-colors group">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <div className="font-medium text-white group-hover:text-[#7d47ea] transition-colors">{project.name}</div>
                    {project.duration && <div className="text-sm text-gray-400">{project.duration}</div>}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditProject(index)}
                      className="h-6 w-6 text-gray-400 hover:text-white"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeProject(index)}
                      className="h-6 w-6 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-1.5 py-0.5 bg-[#2a2a2a] rounded text-xs text-gray-300 border border-[#3a3a3a]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Add/Edit Project Form */}
            <div className="space-y-3 bg-[#1a1a1a] p-3 rounded-lg border border-[#3a3a3a]">
              <div className="space-y-1">
                <label className="text-sm text-gray-400">Project Name</label>
                <Input
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="e.g., AI Resume Builder"
                  className="bg-[#2a2a2a] border-[#3a3a3a] focus:border-[#7d47ea] transition-colors h-8"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-400">Description</label>
                <div className="space-y-2">
                  <Textarea
                    value={newProject.description.join('\n')}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value.split('\n').filter(line => line.trim()) })}
                    placeholder="Enter your project description (one point per line)"
                    className="bg-[#2a2a2a] border-[#3a3a3a] focus:border-[#7d47ea] transition-colors min-h-[60px] text-sm"
                  />
                  <Button
                    type="button"
                    onClick={() => handleGenerateBullets(newProject.description.join('\n'), 'project')}
                    className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border border-[#7d47ea]/50 hover:border-[#7d47ea] transition-colors h-8"
                    disabled={isGeneratingBullets}
                  >
                    {isGeneratingBullets ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⚡</span>
                        Generating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Wand2 className="h-4 w-4" />
                        Generate Bullet Points
                      </span>
                    )}
                  </Button>
                </div>
              </div>
              {generatedBullets.length > 0 && currentType === 'project' && (
                <div className="space-y-2 p-3 bg-[#2a2a2a] rounded-lg border border-[#7d47ea]/50">
                  <h3 className="text-sm font-medium text-white">Generated Bullet Points</h3>
                  <ul className="space-y-1">
                    {generatedBullets.map((bullet, index) => (
                      <li key={index} className="text-sm text-gray-300">• {bullet}</li>
                    ))}
                  </ul>
                  <Button
                    type="button"
                    onClick={applyGeneratedBullets}
                    className="w-full bg-[#7d47ea] hover:bg-[#7d47ea]/90 text-white transition-colors h-8"
                  >
                    Apply Generated Bullets
                  </Button>
                </div>
              )}
              <div className="space-y-1">
                <label className="text-sm text-gray-400">Duration</label>
                <DateRangeSelector
                  startDate={newProject.startDate || undefined}
                  endDate={newProject.endDate || undefined}
                  onStartDateChange={(date) => {
                    if (date) {
                      setNewProject({
                        ...newProject,
                        startDate: date,
                        duration: newProject.endDate ? formatDateRange(date, newProject.endDate) : '',
                      })
                    }
                  }}
                  onEndDateChange={(date) => {
                    if (date) {
                      setNewProject({
                        ...newProject,
                        endDate: date,
                        duration: newProject.startDate ? formatDateRange(newProject.startDate, date) : '',
                      })
                    }
                  }}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-400">Technologies</label>
                <div className="flex gap-2">
                  <Input
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    placeholder="Add technologies used"
                    className="bg-[#2a2a2a] border-[#3a3a3a] focus:border-[#7d47ea] transition-colors h-8"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTechnology()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addTechnology}
                    className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border border-[#7d47ea]/50 hover:border-[#7d47ea] transition-colors h-8 px-3"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {newProject.technologies.map((tech, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-[#2a2a2a] text-white px-2 py-1 rounded-md text-sm"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                type="button"
                onClick={editingProject !== null ? updateProject : addProject}
                className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white border border-[#7d47ea]/50 hover:border-[#7d47ea] transition-colors h-8"
              >
                {editingProject !== null ? "Update Project" : "Add Project"}
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 mb-2">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-[#ffaa40] via-[#7D47EA] to-[#ffaa40] bg-clip-text text-transparent">Additional Information</h2>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-[#7d47ea]/50 to-transparent" />
          </div>
          <div className="space-y-3 bg-[#1a1a1a] p-3 rounded-lg border border-[#3a3a3a]">
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Languages</label>
              <Input
                {...register("languages")}
                placeholder="e.g., English (Native), Spanish (Fluent)"
                className="bg-[#2a2a2a] border-[#3a3a3a] focus:border-[#7d47ea] transition-colors h-8"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Certifications</label>
              <Textarea
                {...register("certifications")}
                placeholder="List your certifications"
                className="bg-[#2a2a2a] border-[#3a3a3a] focus:border-[#7d47ea] transition-colors min-h-[60px] text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">Awards</label>
              <Textarea
                {...register("awards")}
                placeholder="List your awards and achievements"
                className="bg-[#2a2a2a] border-[#3a3a3a] focus:border-[#7d47ea] transition-colors min-h-[60px] text-sm"
              />
            </div>
          </div>
        </div>
      </div>
      <Button type="submit" className="w-full bg-gradient-to-r from-[#ffaa40] via-[#7D47EA] to-[#ffaa40] hover:opacity-90 transition-opacity h-10 sticky bottom-0">
        Save Changes
      </Button>
    </form>
  )
} 