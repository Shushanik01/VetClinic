import { useState, useEffect } from 'react';
import RadioButtons from '../RadioButtons/RadioButtons';

import styles from './Client.module.css';
import gStyles from '../globalAppointment.module.css';
import SelectOption from '~/components/SelectOption/SelectOption';
import { useGetClientsQuery } from '~/store/api/clients/clients-api';
import type { OptionItem } from '~/components/DateAndTime/Types';
import { isValidInternationalPhoneNumber } from '~/utils/phone-number';

const ClientDetails = ({
  onValidChange,
  onClientSelect,
}: {
  onValidChange?: (valid: boolean) => void;

  onClientSelect?: (
    clientId: string,
    pets: Array<{ petId: string; name: string }>
  ) => void;
}) => {
  const { data: clients = [], isLoading: clientsLoading } =
    useGetClientsQuery();
  const [formType, setFormType] = useState('first');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedClientName, setSelectedClientName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const validateName = (
    value: string,
    field: 'First name' | 'Last name'
  ): string => {
    if (!value) return '';
    if (value.length > 50) return `${field} must not exceed 50 characters.`;
    if (!/^[A-Za-z' -]+$/.test(value))
      return `${field} must contain only Latin letters, hyphens, and apostrophes.`;
    return '';
  };

  const validatePhone = (value: string): string => {
    if (!value) return '';
    if (!isValidInternationalPhoneNumber(value))
      return 'Enter a valid international phone number (e.g. +380501234567).';
    return '';
  };

  const validateEmail = (value: string): string => {
    if (!value) return '';
    if (/\s/.test(value)) return 'Email must not contain spaces.';
    if (!value.includes('@')) return 'Email must include an "@" symbol.';
    const [local, ...rest] = value.split('@');
    const domain = rest.join('@');
    if (!local) return 'Email must have a username before "@".';
    if (!domain || !domain.includes('.'))
      return 'Email must have a valid domain (e.g. example.com).';
    if (domain.startsWith('.') || domain.endsWith('.'))
      return 'Email domain is invalid.';
    return '';
  };

  useEffect(() => {
    const valid =
      formType === 'first'
        ? !!selectedClientId
        : !!firstName &&
          !firstNameError &&
          !!lastName &&
          !lastNameError &&
          !!email &&
          !emailError &&
          !!phone &&
          !phoneError;
    onValidChange?.(valid);
  }, [
    formType,
    selectedClientId,
    firstName,
    firstNameError,
    lastName,
    lastNameError,
    email,
    emailError,
    phone,
    phoneError,
    onValidChange,
  ]);

  const clientOptions: OptionItem[] = clients.map((c) => ({
    label: `${c.firstName} ${c.lastName}`,
    value: c.userId,
  }));

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);

    const client = clients.find((c) => c.userId === clientId);
    if (client) {
      setSelectedClientName(`${client.firstName} ${client.lastName}`);
      onClientSelect?.(
        clientId,
        client.pets.map((p) => ({ petId: p.petId, name: p.name }))
      );
    }
    onValidChange?.(!!clientId);
  };

  return (
    <section className={gStyles.section}>
      <RadioButtons
        setFormType={setFormType}
        firstButtonLabel="Registered client"
        secondButtonLabel="Visitor"
      />
      <div className={`${gStyles.formGroup} ${styles[formType]}`}>
        {formType === 'first' ? (
          <>
            <input type="hidden" name="clientName" value={selectedClientName} />
            <label>Client name</label>
            <SelectOption
              name="clientId"
              options={clientOptions}
              placeholder={
                clientsLoading ? 'Loading clients...' : 'Select a client'
              }
              onChange={handleClientSelect}
            />
          </>
        ) : (
          <>
            <div className={styles.visitorWrapper}>
              <div className={gStyles.formGroup}>
                <label htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                    setFirstNameError(
                      validateName(e.target.value, 'First name')
                    );
                  }}
                />
                {firstNameError ? (
                  <small style={{ fontSize: '13px', color: '#ef4444' }}>
                    {firstNameError}
                  </small>
                ) : (
                  <small className={styles.hint}>e.g. Johnson</small>
                )}
              </div>

              <div className={gStyles.formGroup}>
                <label htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    setLastNameError(validateName(e.target.value, 'Last name'));
                  }}
                />
                {lastNameError ? (
                  <small style={{ fontSize: '13px', color: '#ef4444' }}>
                    {lastNameError}
                  </small>
                ) : (
                  <small className={styles.hint}>e.g. Doe</small>
                )}
              </div>
            </div>
            <div className={gStyles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="text"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(validateEmail(e.target.value));
                }}
              />
              {emailError ? (
                <small style={{ fontSize: '13px', color: '#ef4444' }}>
                  {emailError}
                </small>
              ) : (
                <small className={styles.hint}>e.g. username@domain.com</small>
              )}
            </div>

            <div className={gStyles.formGroup}>
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                id="phoneNumber"
                name="phone"
                type="tel"
                placeholder="+38(___)___-__-__"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setPhoneError(validatePhone(e.target.value));
                }}
              />
              {phoneError && (
                <small style={{ fontSize: '13px', color: '#ef4444' }}>
                  {phoneError}
                </small>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ClientDetails;
