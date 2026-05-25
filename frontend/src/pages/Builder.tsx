import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/resumeStore';
import { aiService } from '../services/ai.service';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useReactToPrint } from 'react-to-print';

export const Builder = () => {
    const { id } = useParams<{ id: string }>();

    const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
    const [aiError, setAiError] = useState<null | string>(null)

    const navigate = useNavigate();
    const { currentResume, setCurrentResume, fetchResumes, resumes, updateResume } = useResumeStore();

    const previewRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        documentTitle: `${currentResume?.personalInfo?.fullName || 'Resume'}_Document`,
        contentRef: previewRef,
        onAfterPrint: () => console.log("Document compilation pipeline complete"),
    });

    const [activeTab, setActiveTab] = useState<'personal' | 'summary' | 'experience' | 'projects' | 'skills'>('personal');
    const [isSaving, setIsSaving] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [skillInput, setSkillInput] = useState('');
    const [techInput, setTechInput] = useState<Record<number, string>>({})
    const [expBulletInput, setExpBulletInput] = useState<Record<number, string>>({});
    const [projBulletInput, setProjBulletInput] = useState<Record<number, string>>({});

    useEffect(() => {
        const initializeWorkspace = async () => {
            if (resumes.length === 0) {
                await fetchResumes();
            }
            const found = resumes.find((r) => r._id === id);
            if (found) {
                setCurrentResume({
                    ...found,
                    personalInfo: found.personalInfo || { fullName: '', email: '', phone: '', location: '', linkedIn: '', github: '', portfolio: '' },
                    summary: found.summary || '',
                    skills: found.skills || [],
                    experience: found.experience || [],
                    projects: found.projects || [],
                    education: found.education || []
                });
            }
        };
        initializeWorkspace();
    }, [id, resumes, fetchResumes, setCurrentResume]);

    useEffect(() => {
        const fetchAiSkills = async () => {
            if (!currentResume?.targetRole) return;
            setAiError(null)

            try {
                const response = await aiService.analyzeRoleSkills(currentResume.targetRole);
                if (response.success) {
                    setSuggestedSkills(response.skills);
                }
            } catch (err) {
                const message = err.response?.data?.message || "AI is having high traffic, Try again later";
                setAiError(message)
                console.error("AI Skill Fetch failed", err);
            }
        };

        fetchAiSkills();
    }, [currentResume?.targetRole]);

    if (!currentResume) {
        return <div className="p-8 text-center font-body text-body">Loading Workspace Data Engine...</div>;
    }

    const updateStoreField = (updater: (prev: typeof currentResume) => void) => {
        if (!currentResume) return;
        const updated = { ...currentResume };
        updater(updated);
        setCurrentResume(updated);
    };

    const handleDatabaseSync = async () => {
        if (!id) return;
        setIsSaving(true);
        try {
            await updateResume(id, currentResume)
        } catch (err) {
            console.error("Cloud Save Failed:", err);
        } finally {
            setIsSaving(false);
        }
    };

    const generateAiSummary = async () => {
        setIsAiLoading(true);
        try {
            const response = await aiService.generateSummary({
                targetRole: currentResume.targetRole,
                skills: currentResume.skills,
                projects: currentResume.projects,
                education: currentResume.education,
                experience: currentResume.experience
            });
            if (response.success) {
                updateStoreField((prev) => {
                    if (prev) {
                        prev.summary = response.data;
                    }
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsAiLoading(false);
        }
    };

    const getSkillAnalysis = () => {
        const standardSkills = suggestedSkills;
        const normalizedUser = currentResume.skills.map(s => s.toLowerCase().trim());

        const matched = standardSkills.filter(s => normalizedUser.includes(s.toLowerCase().trim()));
        const missing = standardSkills.filter(s => !normalizedUser.includes(s.toLowerCase().trim()));
        const matchScore = standardSkills.length ? Math.round((matched.length / standardSkills.length) * 100) : 0;

        return { matched, missing, matchScore };
    };

    const { matched, missing, matchScore } = getSkillAnalysis();

    return (
        <div className="min-h-screen bg-canvas text-ink flex flex-col h-screen overflow-hidden">

            <header className="h-16 border-b border-surface-pressed px-8 flex items-center justify-between bg-canvas z-10 shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="subtle" onClick={() => navigate('/dashboard')}>← Dashboard</Button>
                    <h1 className="font-display font-bold text-lg max-w-xs truncate">{currentResume.title}</h1>
                    <span className="text-xs bg-canvas-soft px-3 py-1 rounded-pill border border-surface-pressed font-medium text-body">
                        Target: {currentResume.targetRole}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" onClick={handleDatabaseSync} isLoading={isSaving}>
                        {isSaving ? 'Syncing...' : 'Save Changes'}
                    </Button>
                    <Button variant="primary" onClick={handlePrint}>Download PDF</Button>
                </div>
            </header>


            <div className="flex flex-1 overflow-hidden">


                <div className="w-1/2 overflow-y-auto border-r border-surface-pressed p-8 space-y-8 bg-canvas">

                    <div className="flex border-b border-surface-pressed overflow-x-auto pb-px gap-1">
                        {(['personal', 'summary', 'experience', 'projects', 'skills'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 text-sm font-medium font-body border-b-2 transition-colors capitalize whitespace-nowrap ${activeTab === tab ? 'border-ink text-ink font-bold' : 'border-transparent text-body hover:text-ink'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>


                    {activeTab === 'personal' && (
                        <div className="space-y-4 animate-fade-in">
                            <h3 className="font-display font-bold text-xl mb-4">Personal Details</h3>
                            <Input
                                label="Full Name"
                                value={currentResume.personalInfo?.fullName || ''}
                                onChange={(e) => updateStoreField((prev) => {
                                    if (prev) {
                                        prev.personalInfo.fullName = e.target.value;
                                    }
                                })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Email"
                                    value={currentResume.personalInfo?.email || ''}
                                    onChange={(e) => updateStoreField((prev) => {
                                        if (prev) {
                                            prev.personalInfo.email = e.target.value;
                                        }
                                    })}
                                />
                                <Input
                                    label="Phone Number"
                                    value={currentResume.personalInfo?.phone || ''}
                                    onChange={(e) => updateStoreField((prev) => {
                                        if (prev) {
                                            prev.personalInfo.phone = e.target.value;
                                        }
                                    })}
                                />
                            </div>
                            <Input
                                label="Location (City, State)"
                                value={currentResume.personalInfo?.location || ''}
                                onChange={(e) => updateStoreField((prev) => {
                                    if (prev) {
                                        prev.personalInfo.location = e.target.value;
                                    }
                                })}
                            />
                            <div className="grid grid-cols-3 gap-4">
                                <Input
                                    label="LinkedIn URL"
                                    value={currentResume.personalInfo?.linkedIn || ''}
                                    onChange={(e) => updateStoreField((prev) => {
                                        if (prev) {
                                            prev.personalInfo.linkedIn = e.target.value;
                                        }
                                    })}
                                />
                                <Input
                                    label="GitHub URL"
                                    value={currentResume.personalInfo?.github || ''}
                                    onChange={(e) => updateStoreField((prev) => {
                                        if (prev) {
                                            prev.personalInfo.github = e.target.value;
                                        }
                                    })}
                                />
                                <Input
                                    label="Portfolio URL"
                                    value={currentResume.personalInfo?.portfolio || ''}
                                    onChange={(e) => updateStoreField((prev) => {
                                        if (prev) {
                                            prev.personalInfo.portfolio = e.target.value;
                                        }
                                    })}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'summary' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-display font-bold text-xl">Professional Profile Summary</h3>
                                <Button variant="subtle" onClick={generateAiSummary} isLoading={isAiLoading}>
                                    ✨ Generate with Gemini
                                </Button>
                            </div>
                            <textarea
                                className="w-full h-40 bg-canvas-soft border border-transparent rounded-md p-4 font-body text-ink focus:outline-none focus:ring-2 focus:ring-ink"
                                placeholder="Write your profile summary or trigger the Gemini API engine up top to construct an optimized version..."
                                value={currentResume.summary || ''}
                                onChange={(e) => updateStoreField((prev) => {
                                    if (prev) {
                                        prev.summary = e.target.value;
                                    }
                                })}
                            />
                        </div>
                    )}

                    {activeTab === 'experience' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="font-display font-bold text-xl">Work History</h3>
                                <Button variant="subtle" onClick={() => updateStoreField((prev) => {
                                    if (prev) {
                                        prev.experience.push({ company: '', role: '', startDate: '', endDate: '', currentlyWorking: false, bulletPoints: [] });
                                    }
                                })}>+ Add Position</Button>
                            </div>

                            {currentResume.experience.map((exp, index) => (
                                <div key={index} className="p-4 bg-canvas-soft rounded-xl space-y-4 relative border border-surface-pressed">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Company Name" value={exp.company} onChange={(e) => updateStoreField((prev) => {
                                            if (prev) {
                                                prev.experience[index].company = e.target.value;
                                            }
                                        })} />
                                        <Input label="Job Role Title" value={exp.role} onChange={(e) => updateStoreField((prev) => {
                                            if (prev) {
                                                prev.experience[index].role = e.target.value;
                                            }
                                        })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label="Start Date" value={exp.startDate} onChange={(e) => updateStoreField((prev) => {
                                            if (prev) {
                                                prev.experience[index].startDate = e.target.value;
                                            }
                                        })} />
                                        <Input label="End Date" value={exp.endDate} disabled={exp.currentlyWorking} onChange={(e) => updateStoreField((prev) => {
                                            if (prev) {
                                                prev.experience[index].endDate = e.target.value;
                                            }
                                        })} />
                                    </div>


                                    <div className="space-y-2">
                                        <label className="text-sm font-medium block">Key Description Metrics</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Add descriptive responsibility bullet point..."
                                                className="flex-1 bg-canvas text-ink px-3 py-2 text-sm rounded-md border border-surface-pressed focus:outline-none"
                                                value={expBulletInput[index] || ''}
                                                onChange={(e) => setExpBulletInput({ ...expBulletInput, [index]: e.target.value })}
                                            />
                                            <Button variant="secondary" className="py-1 text-sm" onClick={() => {
                                                if (!expBulletInput[index]) return;
                                                updateStoreField((prev) => {
                                                    if (prev) {

                                                        if (!prev.experience[index].bulletPoints) {
                                                            prev.experience[index].bulletPoints = [];
                                                        }
                                                        prev.experience[index].bulletPoints.push(expBulletInput[index]);
                                                    };
                                                })
                                                setExpBulletInput({ ...expBulletInput, [index]: '' });
                                            }}>Add</Button>
                                        </div>
                                        <ul className="list-disc pl-5 text-sm text-body space-y-1">
                                            {(exp.bulletPoints || []).map((bp: string, bpIdx: number) => (
                                                <li key={bpIdx}>{bp}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'projects' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="font-display font-bold text-xl">Technical Projects</h3>
                                <Button variant="subtle" onClick={() => updateStoreField((prev) => {
                                    if (prev) {
                                        prev.projects.push({ title: '', technologies: [], description: '', bulletPoints: [], link: '' });
                                    }
                                })}>+ Add Project</Button>
                            </div>

                            {currentResume.projects.map((proj, index) => (
                                <div key={index} className="p-4 bg-canvas-soft rounded-xl space-y-4 border border-surface-pressed">
                                    <Input label="Project Title" value={proj.title} onChange={(e) => updateStoreField((prev) => {
                                        if (prev) {
                                            prev.projects[index].title = e.target.value;
                                        }
                                    })} />
                                    <Input label="Technologies Used (Comma Separated)"
                                        value={techInput[index] ?? (proj.technologies?.join(', ') || '')}
                                        onChange={(e) => setTechInput({ ...techInput, [index]: e.target.value })}
                                        onBlur={() => updateStoreField((prev) => {
                                            if (prev) {
                                                prev.projects[index].technologies = (techInput[index] ?? '')
                                                    .split(',')
                                                    .map((s: string) => s.trim())
                                                    .filter(Boolean)
                                            }
                                        })} />

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium block">Project Core Descriptions</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Add engineering action description..."
                                                className="flex-1 bg-canvas text-ink px-3 py-2 text-sm rounded-md border border-surface-pressed"
                                                value={projBulletInput[index] || ''}
                                                onChange={(e) => setProjBulletInput({ ...projBulletInput, [index]: e.target.value })}
                                            />
                                            <Button variant="secondary" className="py-1 text-sm"
                                                onClick={() => {
                                                    if (!projBulletInput[index]) return;

                                                    updateStoreField((prev) => {
                                                        if (prev && prev.projects && prev.projects[index]) {

                                                            if (!prev.projects[index].bulletPoints) {
                                                                prev.projects[index].bulletPoints = [];
                                                            }

                                                            prev.projects[index].bulletPoints.push(projBulletInput[index]);
                                                        }
                                                    });

                                                    setProjBulletInput({ ...projBulletInput, [index]: '' });
                                                }}
                                            >Add</Button>
                                        </div>
                                        <ul className="list-disc pl-5 text-sm text-body space-y-1">
                                            {(proj.bulletPoints || []).map((bp: string, bpIdx: number) => (
                                                <li key={bpIdx}>{bp}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'skills' && (
                        <div className="space-y-6">
                            <h3 className="font-display font-bold text-xl">Skills Entry</h3>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    placeholder="Type a skill (e.g. React, TypeScript) and hit enter..."
                                    className="flex-1 bg-canvas-soft text-ink rounded-md px-4 py-3 border border-transparent focus:outline-none focus:ring-2 focus:ring-ink"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && skillInput.trim()) {
                                            updateStoreField((prev) => {
                                                if (prev && !prev.skills.includes(skillInput.trim())) {
                                                    prev.skills.push(skillInput.trim());
                                                }
                                            });
                                            setSkillInput('');
                                        }
                                    }}
                                />
                                <Button onClick={() => {
                                    if (!skillInput.trim()) return;
                                    updateStoreField((prev) => {
                                        if (prev && !prev.skills.includes(skillInput.trim())) {
                                            prev.skills.push(skillInput.trim());
                                        }
                                    });
                                    setSkillInput('');
                                }}>Add</Button>
                            </div>


                            <div className="flex flex-wrap gap-2">
                                {currentResume.skills.map((skill, index) => (
                                    <span key={index} className="bg-primary text-on-primary text-sm px-3 py-1.5 rounded-pill flex items-center gap-2">
                                        {skill}
                                        <button className="text-xs hover:text-red-400 font-bold ml-1" onClick={() => updateStoreField((prev) => {
                                            if (prev) {
                                                prev.skills = prev.skills.filter((_, i) => i !== index);
                                            }
                                        })}>×</button>
                                    </span>
                                ))}
                            </div>


                            <div className="border border-surface-pressed rounded-xl p-6 space-y-4 bg-canvas-softer">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-display font-bold text-base">Target Role Analysis Engine</h4>
                                    <span className="font-display font-bold text-xl text-primary">{matchScore}% Match</span>
                                </div>


                                <div className="w-full bg-surface-pressed h-2 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full transition-all duration-500" style={{ width: `${matchScore}%` }}></div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <h5 className="text-xs uppercase tracking-wider font-bold text-ink mb-2">Matched Skills ({matched.length})</h5>
                                        <div className="flex flex-wrap gap-1">
                                            {matched.map((s, i) => <span key={i} className="text-xs bg-canvas text-ink border border-surface-pressed px-2 py-0.5 rounded-md">{s}</span>)}
                                        </div>
                                    </div>
                                    <div>
                                        <h5 className="text-xs uppercase tracking-wider font-bold text-body mb-2">Recommended Gaps ({missing.length})</h5>
                                        <div className="flex flex-wrap gap-1">
                                            {aiError && <p className="text-xs uppercase tracking-wider font-bold text-body">{aiError}</p>}
                                            {missing.map((s, i) => (
                                                <button key={i} className="text-xs bg-white text-body border border-dashed border-mute px-2 py-0.5 rounded-md hover:bg-primary hover:text-white transition-colors" onClick={() => updateStoreField((prev) => {
                                                    if (prev && !prev.skills.includes(s)) {
                                                        prev.skills.push(s);
                                                    }
                                                })}>
                                                    + {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>


                <div className="w-1/2 bg-canvas-soft p-8 overflow-y-auto flex justify-center items-start">
                    <div className="sticky top-0 w-full max-w-[210mm] shadow-lg border border-surface-pressed bg-white"
                        style={{ minHeight: '297mm' }}>


                        <div
                            ref={previewRef}
                            id='resume'
                            className="w-full bg-white text-black p-[10mm] selection:bg-surface-pressed"
                            style={{ boxSizing: 'border-box' }}
                        >

                            <div className="text-center space-y-2">

                                <h2 className="text-3xl tracking-tight capitalize  text-black">

                                    {currentResume.personalInfo?.fullName || 'YOUR NAME'}

                                </h2>

                                <div className="text-xs  text-gray-700 space-x-2 flex justify-between flex-wrap gap-y-1">

                                    {
                                        currentResume.personalInfo?.email &&
                                        <a href={`mailto:${currentResume.personalInfo.email}`}>
                                            {currentResume.personalInfo.email}
                                        </a>
                                    }

                                    {
                                        currentResume.personalInfo?.phone &&
                                        <span>
                                            {currentResume.personalInfo.phone}
                                        </span>
                                    }

                                    {
                                        currentResume.personalInfo?.location &&
                                        <span>{currentResume.personalInfo.location}</span>
                                    }


                                    {
                                        currentResume.personalInfo?.linkedIn &&
                                        <a href={`https://${currentResume.personalInfo.linkedIn}`} rel="noopener noreferrer" target="_blank">
                                            {currentResume.personalInfo.linkedIn}
                                        </a>
                                    }


                                    {
                                        currentResume.personalInfo?.github &&
                                        <a href={`https://${currentResume.personalInfo.github}`} rel="noopener noreferrer" target="_blank">
                                            {currentResume.personalInfo.github}
                                        </a>
                                    }

                                    {
                                        currentResume.personalInfo?.portfolio &&
                                        <a href={`https://${currentResume.personalInfo.portfolio}`} rel="noopener noreferrer" target="_blank">
                                            {currentResume.personalInfo.portfolio}
                                        </a>
                                    }

                                </div>

                            </div>


                            {currentResume.summary && (
                                <div className="mt-6">
                                    <h3 className=" tracking-wider font-semibold  border-b border-gray-300 pb-0.5 mb-2">Professional Profile</h3>
                                    <p className="text-sm leading-[1.2] text-gray-900">{currentResume.summary}</p>
                                </div>
                            )}


                            {currentResume.experience.length > 0 && (
                                <div className="mt-6">
                                    <h3 className=" tracking-wider font-semibold  border-b border-gray-300 pb-0.5 mb-2">Experience</h3>
                                    <div className="space-y-4">
                                        {currentResume.experience.map((exp, idx) => (
                                            <div key={idx} className="text-sm">
                                                <div className="flex justify-between font-bold text-gray-900">
                                                    <span>{exp.role} — {exp.company}</span>
                                                    <span className="font-normal text-xs text-gray-600">{exp.startDate} – {exp.endDate || 'Present'}</span>
                                                </div>
                                                <ul className="list-disc pl-5 mt-1 text-gray-800 space-y-0.5 text-xs leading-relaxed">
                                                    {exp.bulletPoints?.map((bp: string, i: number) => <li key={i}>{bp}</li>)}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}


                            {currentResume.projects.length > 0 && (
                                <div className="mt-6">
                                    <h3 className=" capitalize tracking-wider font-bold  border-b border-gray-300 pb-0.5 mb-2">Projects</h3>
                                    <div className="space-y-4">
                                        {currentResume.projects.map((proj, idx) => (
                                            <div key={idx} className="text-sm">
                                                <div className="flex justify-between font-bold text-gray-900">
                                                    <span>{proj.title} <span className="font-normal text-xs text-gray-600  italic">({proj.technologies?.join(', ')})</span></span>
                                                </div>
                                                <ul className="list-disc pl-5 mt-1 text-gray-800 space-y-0.5 text-xs leading-relaxed">
                                                    {(proj.bulletPoints || []).map((bp: string, i: number) => <li key={i}>{bp}</li>)}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}


                            {currentResume.skills.length > 0 && (
                                <div className="mt-6">
                                    <h3 className=" tracking-wider font-bold  border-b border-gray-300 pb-0.5 mb-2">Technical Skills</h3>
                                    <p className="text-sm text-gray-900 leading-relaxed capitalize">
                                        {currentResume.skills.join(', ')}
                                    </p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

            </div>
        </div >
    );
};