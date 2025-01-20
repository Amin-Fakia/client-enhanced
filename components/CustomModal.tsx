import React from 'react'
import {


    Modal,
    useDisclosure,
    ModalContent,
    ModalHeader,
    ModalBody,

  
  } from "@nextui-org/react";
  


  interface CustomModalProps {
    // Add any custom props you want to pass to your Modal component
    isOpen: boolean;
    onOpenChange: () => void;
    children: React.ReactNode;
  }
  
  const CustomModal: React.FC<CustomModalProps> = ({
    isOpen,
    onOpenChange,
    children,
  }) => {
    const { isOpen: disclosureIsOpen, onOpen, onClose } = useDisclosure();
  
    return (
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
        }}
      >
        <ModalContent>
          <ModalHeader>
            <h2>Custom Modal Header</h2>
          </ModalHeader>
          <ModalBody>
            {children}
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };

export default CustomModal