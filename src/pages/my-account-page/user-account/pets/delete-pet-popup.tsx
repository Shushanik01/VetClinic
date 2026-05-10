import type { FC } from 'react';

import { PopupWindow } from '~/components/pop-up-window/popup-window';
import type { PetResponse } from '~/store/api/pets/pets-types';

export type DeletePetPopupProps = {
  pet: PetResponse | null;
  isDeleting?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export const DeletePetPopup: FC<DeletePetPopupProps> = ({
  pet,
  isDeleting = false,
  onCancel,
  onConfirm,
}) => {
  if (!pet) return null;

  return (
    <PopupWindow onClose={onCancel}>
      <div className="bg-neutral-0 rounded-[16px] p-[32px] flex flex-col gap-[24px] w-[544px] max-w-full">
        <h2 className="text-h2 text-black-900">Delete Pet?</h2>
        <p className="text-body-m-regular text-black-900">
          Are you sure you want to delete{' '}
          <span className="font-bold">{pet.petName}</span>?
        </p>
        <p className="text-body-m-regular text-black-900 font-bold">
          You will lose the pet’s medical history and cannot get it back.
        </p>
        <div className="mt-[8px] flex justify-end gap-[16px]">
          <button
            type="button"
            className="btn-white-l disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-regular-l disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            Delete Pet
          </button>
        </div>
      </div>
    </PopupWindow>
  );
};
