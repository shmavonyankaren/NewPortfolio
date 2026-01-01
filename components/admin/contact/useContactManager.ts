import { useState, useEffect } from "react";

export interface Contact {
  _id?: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  github?: string;
  twitter?: string;
  website?: string;
  cvUrl?: string;
}

interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

export function useContactManager() {
  const normalizeContact = (contact: Partial<Contact>): Contact => ({
    _id: contact._id,
    email: contact.email ?? "",
    phone: contact.phone ?? "",
    location: contact.location ?? "",
    linkedIn: contact.linkedIn ?? "",
    github: contact.github ?? "",
    twitter: contact.twitter ?? "",
    website: contact.website ?? "",
    cvUrl: contact.cvUrl ?? "",
  });

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Contact>({
    email: "",
    phone: "",
    location: "",
    linkedIn: "",
    github: "",
    twitter: "",
    website: "",
    cvUrl: "",
  });
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/admin/contacts");
      const data = await res.json();
      setContacts(Array.isArray(data) ? data.map(normalizeContact) : []);
    } catch (error) {
      console.error("Failed to fetch contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        linkedIn: formData.linkedIn,
        github: formData.github,
        twitter: formData.twitter,
        website: formData.website,
        cvUrl: formData.cvUrl,
      };

      if (editingId) {
        console.log(
          "Updating contact with ID:",
          editingId,
          "Payload:",
          payload
        );
        const res = await fetch(`/api/admin/contacts/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.error("Update failed:", err);
          throw new Error(err.error || "Failed to update contact");
        }
        const updated = await res.json();
        console.log("Update successful:", updated);
        setContacts(
          contacts.map((c) =>
            c._id === editingId ? normalizeContact(updated) : c
          )
        );
      } else {
        console.log("Creating new contact with Payload:", payload);
        const res = await fetch("/api/admin/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          console.error("Create failed:", err);
          throw new Error(err.error || "Failed to create contact");
        }
        const newContact = await res.json();
        console.log("Contact created successfully:", newContact);
        setContacts([...contacts, normalizeContact(newContact)]);
      }
      resetForm();
    } catch (error) {
      console.error("Failed to save contact:", error);
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Contact",
      message:
        "Are you sure you want to delete this contact? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/admin/contacts/${id}`, {
            method: "DELETE",
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || "Failed to delete contact");
          }
          setContacts(contacts.filter((c) => c._id !== id));
        } catch (error) {
          console.error("Failed to delete contact:", error);
        }
      },
    });
  };

  const handleDeleteAll = async () => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete All Contacts",
      message: `Are you sure you want to delete all ${contacts.length} contacts? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const res = await fetch("/api/admin/contacts", { method: "DELETE" });
          if (!res.ok) {
            throw new Error("Failed to delete all contacts");
          }
          setContacts([]);
          console.log("All contacts deleted successfully");
        } catch (error) {
          console.error("Failed to delete all contacts:", error);
          alert("Error deleting all contacts");
        }
      },
    });
  };

  const handleEdit = (contact: Contact) => {
    setFormData(contact);
    setEditingId(contact._id || null);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      email: "",
      phone: "",
      location: "",
      linkedIn: "",
      github: "",
      twitter: "",
      website: "",
      cvUrl: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  return {
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
  };
}
