// GlobalProvider.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import Modal from "@/components/modals/Modal/Modal";

interface GlobalContextType {
  isModalOpen: boolean;
  openModal: (content: ReactNode, title?: string) => void;
  closeModal: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [modalTitle, setModalTitle] = useState<string>("");

  const openModal = (content: ReactNode, title = "") => {
    setModalContent(content);
    setModalTitle(title);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setModalTitle("");
  };

  return (
    <GlobalContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      {children}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
        {modalContent}
      </Modal>
    </GlobalContext.Provider>
  );
};

export const useGlobal = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }
  return context;
};
