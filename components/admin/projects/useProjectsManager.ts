import { useState, useEffect } from "react";

export interface Technology {
  name: string;
  icon?: string;
}

export interface Feature {
  title: string;
  description: string;
}

export interface Challenge {
  challenge: string;
  solution: string;
}

export interface Project {
  _id?: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  technologies: Technology[];
  features: Feature[];
  challenges: Challenge[];
  demoUrl?: string;
  githubUrl?: string;
  duration: string;
  teamType: "solo" | "team";
  status: "Live & Maintained" | "In Development" | "Planned";
}

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

export function useProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [formData, setFormData] = useState<Project>({
    title: "",
    description: "",
    shortDescription: "",
    image: "",
    technologies: [],
    features: [],
    challenges: [],
    demoUrl: "",
    githubUrl: "",
    duration: "",
    teamType: "solo",
    status: "Live & Maintained",
  });
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Input states for adding items
  const [showTechInput, setShowTechInput] = useState(false);
  const [tempTech, setTempTech] = useState({ name: "", icon: "" });

  const [showFeatureInput, setShowFeatureInput] = useState(false);
  const [tempFeature, setTempFeature] = useState({
    title: "",
    description: "",
  });

  const [showChallengeInput, setShowChallengeInput] = useState(false);
  const [tempChallenge, setTempChallenge] = useState({
    challenge: "",
    solution: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous error
    setErrorMessage("");

    // Validate required fields before submitting
    const missingFields = [];
    if (!formData.title?.trim()) missingFields.push("Title");
    if (!formData.description?.trim()) missingFields.push("Description");
    if (!formData.shortDescription?.trim())
      missingFields.push("Short Description");
    if (!formData.image?.trim()) missingFields.push("Image");

    if (missingFields.length > 0) {
      setErrorMessage(
        `Please fill in the following required fields: ${missingFields.join(
          ", "
        )}`
      );
      return;
    }

    try {
      const id = editingId || "new";
      setSubmittingId(id);
      if (editingId) {
        console.log(
          "Updating project with ID:",
          editingId,
          "FormData:",
          formData
        );
        // Don't send _id in the PUT request body
        const { _id, ...updateData } = formData;
        const res = await fetch(`/api/admin/projects/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.error("Update failed:", err);
          throw new Error(err.error || "Failed to update project");
        }
        const updated = await res.json();
        console.log("Update successful:", updated);
        setProjects(projects.map((p) => (p._id === editingId ? updated : p)));
      } else {
        console.log("Creating new project with FormData:", formData);
        // Don't send _id in the POST request body either
        const { _id, ...createData } = formData;
        const res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(createData),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.error("Create failed:", err);
          throw new Error(err.error || "Failed to create project");
        }
        const newProject = await res.json();
        console.log("Project created successfully:", newProject);
        setProjects([...projects, newProject]);
      }
      resetForm();
    } catch (error) {
      console.error("Failed to save project:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to save project";
      alert(errorMessage);
    } finally {
      setSubmittingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Project",
      message:
        "Are you sure you want to delete this project? This action cannot be undone.",
      onConfirm: async () => {
        try {
          setDeletingId(id);
          const res = await fetch(`/api/admin/projects/${id}`, {
            method: "DELETE",
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || "Failed to delete project");
          }
          setProjects(projects.filter((p) => p._id !== id));
        } catch (error) {
          console.error("Failed to delete project:", error);
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  const handleDeleteAll = async () => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete All Projects",
      message: `Are you sure you want to delete all ${projects.length} projects? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          setDeletingId("all");
          const res = await fetch("/api/admin/projects", { method: "DELETE" });
          if (!res.ok) {
            throw new Error("Failed to delete all projects");
          }
          setProjects([]);
          console.log("All projects deleted successfully");
        } catch (error) {
          console.error("Failed to delete all projects:", error);
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  const handleEdit = (project: Project) => {
    setFormData(project);
    setEditingId(project._id || null);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      shortDescription: "",
      image: "",
      technologies: [],
      features: [],
      challenges: [],
      demoUrl: "",
      githubUrl: "",
      duration: "",
      teamType: "solo",
      status: "Live & Maintained",
    });
    setEditingId(null);
    setShowForm(false);
    setErrorMessage("");
    setShowTechInput(false);
    setTempTech({ name: "", icon: "" });
    setShowFeatureInput(false);
    setTempFeature({ title: "", description: "" });
    setShowChallengeInput(false);
    setTempChallenge({ challenge: "", solution: "" });
  };

  // Technology handlers
  const handleAddTechnology = () => {
    if (tempTech.name.trim()) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, tempTech],
      });
      setTempTech({ name: "", icon: "" });
      setShowTechInput(false);
    }
  };

  const handleRemoveTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((_, i) => i !== index),
    });
  };

  // Feature handlers
  const handleAddFeature = () => {
    if (tempFeature.title.trim() && tempFeature.description.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, tempFeature],
      });
      setTempFeature({ title: "", description: "" });
      setShowFeatureInput(false);
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  // Challenge handlers
  const handleAddChallenge = () => {
    if (tempChallenge.challenge.trim() && tempChallenge.solution.trim()) {
      setFormData({
        ...formData,
        challenges: [...formData.challenges, tempChallenge],
      });
      setTempChallenge({ challenge: "", solution: "" });
      setShowChallengeInput(false);
    }
  };

  const handleRemoveChallenge = (index: number) => {
    setFormData({
      ...formData,
      challenges: formData.challenges.filter((_, i) => i !== index),
    });
  };

  return {
    projects,
    loading,
    showForm,
    editingId,
    submittingId,
    deletingId,
    formData,
    errorMessage,
    confirmDialog,
    showTechInput,
    tempTech,
    showFeatureInput,
    tempFeature,
    showChallengeInput,
    tempChallenge,
    setShowForm,
    setFormData,
    setConfirmDialog,
    setShowTechInput,
    setTempTech,
    setShowFeatureInput,
    setTempFeature,
    setShowChallengeInput,
    setTempChallenge,
    handleSubmit,
    handleDelete,
    handleDeleteAll,
    handleEdit,
    resetForm,
    handleAddTechnology,
    handleAddFeature,
    handleAddChallenge,
  };
}
