"use client";

import type { ReactNode } from "react";

import { Contact } from "./useContactManager";
import ContactCard from "./ContactCard";

interface ContactListProps {
  contacts: Contact[];
  editForm: ReactNode;
  editingId: string | null;
  disabled: boolean;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
}

export default function ContactList({
  contacts,
  editForm,
  editingId,
  disabled,
  onEdit,
  onDelete,
}: ContactListProps) {
  if (contacts.length === 0) {
    return (
      <div className="bg-white border border-slate-200 dark:bg-white/5 dark:border-white/10 rounded-lg p-8 text-center">
        <p className="text-slate-600 dark:text-gray-400 text-lg">
          No contact information yet. Click &quot;Add Contact&quot; to create
          one.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {contacts
        .map((contact, index) => (
          <div key={contact._id || index} data-contact-id={contact._id}>
          {contact._id === editingId ? editForm : <ContactCard
            key={contact._id || `contact-${index}-${contact.email}`}
            contact={contact}
            onEdit={() => onEdit(contact)}
            onDelete={() => onDelete(contact._id!)}
            disabled={disabled}
          />}
          </div>
        ))}
    </div>
  );
}
