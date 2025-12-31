"use client";

import ConfirmDialog from "./ConfirmDialog";
import {
  ProjectForm,
  ProjectHeader,
  ProjectList,
  useProjectsManager,
} from "./projects";

export default function ProjectsManager() {
  const {
    projects,
    loading,
    showForm,
    editingId,
    submittingId,
    deletingId,
    formData,
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
  } = useProjectsManager();

  if (loading)
    return (
      <div className="text-slate-900 dark:text-white">Loading projects...</div>
    );

  return (
    <div className="space-y-6">
      <ProjectHeader
        projectCount={projects.length}
        showForm={showForm}
        editingId={editingId}
        onToggleForm={() => (showForm ? resetForm() : setShowForm(true))}
        onDeleteAll={handleDeleteAll}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Delete"
      />

      {showForm && (
        <ProjectForm
          formData={formData}
          editingId={editingId}
          showTechInput={showTechInput}
          tempTech={tempTech}
          showFeatureInput={showFeatureInput}
          tempFeature={tempFeature}
          showChallengeInput={showChallengeInput}
          tempChallenge={tempChallenge}
          onFormDataChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          onShowTechInput={setShowTechInput}
          onTempTechChange={setTempTech}
          onAddTechnology={handleAddTechnology}
          onShowFeatureInput={setShowFeatureInput}
          onTempFeatureChange={setTempFeature}
          onAddFeature={handleAddFeature}
          onShowChallengeInput={setShowChallengeInput}
          onTempChallengeChange={setTempChallenge}
          onAddChallenge={handleAddChallenge}
        />
      )}

      <ProjectList
        projects={projects}
        editingId={editingId}
        disabled={showForm}
        submittingId={submittingId}
        deletingId={deletingId}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
