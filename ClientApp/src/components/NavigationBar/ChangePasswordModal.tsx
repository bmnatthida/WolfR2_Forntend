import { Modal } from "antd";
import React from "react";
import {
  Control,
  Controller,
  FieldError,
  UseFormHandleSubmit,
} from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { FiSave } from "react-icons/fi";
import { useTranslation } from "react-i18next";

type ChangePasswordModalProps = {
  visible: boolean;
  handleCancel: () => void;
  onSubmitPassword: (data: any) => void;
  handleSubmit: UseFormHandleSubmit<{
    current_password: string;
    new_password: string;
    comfirm_password: string;
  }>;
  control: Control<
    {
      current_password: string;
      new_password: string;
      comfirm_password: string;
    },
    object
  >;
  errors: {
    current_password?: FieldError | undefined;
    new_password?: FieldError | undefined;
    comfirm_password?: FieldError | undefined;
  };
  isPasswordCompared: boolean;
};

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  visible,
  handleCancel,
  onSubmitPassword,
  handleSubmit,
  control,
  errors,
  isPasswordCompared,
}) => {
  const { t } = useTranslation(["translation"]);
  return (
    <Modal
      closeIcon={<IoMdClose />}
      className="modal-password"
      width={800}
      visible={visible}
      footer={false}
      onCancel={handleCancel}
    >
      <form onSubmit={handleSubmit(onSubmitPassword)}>
        <div className="input-change-password-container">
          <p className="text-header">{t("Change Password")}</p>
          <div className="main-input-change-container">
            <div className="input-container">
              <div className="text-container">
                <p className="text-label">
                  Current Password : <span>*</span>
                </p>
                <p className="text-desc">รหัสผ่านปัจจุบัน :</p>
              </div>
              <Controller
                name="current_password"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="input-password-container">
                    <input
                      {...field}
                      type="password"
                      className={`input-password ${
                        errors.current_password ? "invalid" : ""
                      }`}
                    />
                    {errors.current_password && (
                      <p className="text-error">กรุณากรอกข้อมูล</p>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="input-container">
              <div className="text-container">
                <p className="text-label">
                  New Password : <span>*</span>
                </p>
                <p className="text-desc">รหัสผ่านใหม่ :</p>
              </div>
              <Controller
                name="new_password"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="input-password-container">
                    <input
                      {...field}
                      type="password"
                      className={`input-password ${
                        errors.new_password ? "invalid" : ""
                      }`}
                    />
                    {errors.new_password && (
                      <p className="text-error">กรุณากรอกข้อมูล</p>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="input-container">
              <div className="text-container">
                <p className="text-label">
                  Confirm Password : <span>*</span>
                </p>
                <p className="text-desc">ยืนยันรหัสผ่าน :</p>
              </div>
              <Controller
                name="comfirm_password"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <div className="input-password-container">
                    <input
                      {...field}
                      type="password"
                      className={`input-password ${
                        errors.comfirm_password || !isPasswordCompared
                          ? "invalid"
                          : ""
                      }`}
                    />
                    {errors.comfirm_password && (
                      <p className="text-error">กรุณากรอกข้อมูล</p>
                    )}
                    {!isPasswordCompared && (
                      <p className="text-error">กรุณากรอกรหัสผ่านให้ตรงกัน</p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
          <div className="button-container">
            <button
              className="button-cancle"
              type="button"
              onClick={handleCancel}
            >
              Close
            </button>

            <button className="button-save" type="submit">
              <FiSave />
              Save
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;
