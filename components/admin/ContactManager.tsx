"use client";

import ConfirmDialog from "./ConfirmDialog";
import {
  ContactForm,
  ContactHeader,
  ContactList,
  useContactManager,
} from "./contact";

export default function ContactManager() {
  const {
    contacts,
    loading,
    showForm,
    editingId,
    formData,
    confirmDialog,
    setShowForm,
    setFormData,
    setConfirmDialog,
    handleSubmit,
    handleDelete,
    handleDeleteAll,
    handleEdit,
    resetForm,
  } = useContactManager();

  if (loading)
    return (
      <div className="text-slate-900 dark:text-white">Loading contacts...</div>
    );

  return (
    <div className="space-y-6">
      <ContactHeader
        contactCount={contacts.length}
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
        <ContactForm
          formData={formData}
          editingId={editingId}
          onFormDataChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      )}

      <ContactList
        contacts={contacts}
        editingId={editingId}
        disabled={showForm}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
