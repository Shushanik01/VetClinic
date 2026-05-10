import React from 'react';
import { useState, useEffect, useRef } from 'react';
import styles from './table.module.css';
import filterIcon from '~/assets/svg/filterIcon.svg';
import Editor from '~/assets/svg/Editor.svg';
import deleteIcon from '~/assets/svg/delete.svg';
import noSearchIcon from '~/assets/svg/icons/nosearch.svg';

export interface Data {
  id: number;
  appointmentId: string;
  veterinarianId: string;
  clientName: string;
  petName: string;
  petAge: string;
  vetName: string;
  address: string;
  specialty: string;
  date: string;
  status: string;
}

interface Header {
  id: number;
  title: string;
  filter: boolean;
  dataKey?: keyof Data;
}

interface TableProps {
  data: Data[];
  onDeleteClick: (id: number) => void;
  onEditClick: (id: number) => void;
  setComponentType: (value: 'Cancel' | 'Reschedule') => void;
  onFilteredCountChange?: (count: number) => void;
  onFilteredAddressChange?: (address: string | null) => void;
  activeDate?: string;
}
const getLocalToday = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const Table: React.FC<TableProps> = ({
  data,
  onDeleteClick,
  onEditClick,
  setComponentType,
  onFilteredCountChange,
  onFilteredAddressChange,
  activeDate,
}) => {
  const [openFilterId, setOpenFilterId] = useState<number | null>(null);
  const [filters, setFilters] = useState<Partial<Record<keyof Data, string>>>(
    {}
  );
  const [dateFilter, setDateFilter] = useState<string>(getLocalToday());

  useEffect(() => {
    if (activeDate) {
      setDateFilter(activeDate);
    }
  }, [activeDate]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpenFilterId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterSelect = (dataKey: keyof Data, value: string) => {
    if (dataKey === 'date') {
      setDateFilter((prev) => (prev === value ? '' : value));
    } else {
      setFilters((prev) => {
        if (prev[dataKey] === value) {
          const { [dataKey]: _removed, ...rest } = prev;
          return rest;
        }
        return { ...prev, [dataKey]: value };
      });
      setDateFilter((prev) => (prev === getLocalToday() ? '' : prev));
    }
    setOpenFilterId(null);
  };

  const filteredData = data.filter((row) => {
    const nonDateMatch = (
      Object.entries(filters) as [keyof Data, string | undefined][]
    ).every(([key, value]) => !value || row[key] === value);
    const dateMatch = !dateFilter || row.date.slice(0, 10) === dateFilter;
    return nonDateMatch && dateMatch;
  });

  useEffect(() => {
    onFilteredCountChange?.(filteredData.length);
  }, [filteredData.length]);

  useEffect(() => {
    onFilteredAddressChange?.(filters.address ?? null);
  }, [filters.address]);

  const header: Header[] = [
    { id: 1, title: 'Client Name', filter: true, dataKey: 'clientName' },
    { id: 2, title: 'Pet Name', filter: false },
    { id: 3, title: 'Pet Age', filter: false },
    { id: 4, title: 'Veterinarian Name', filter: true, dataKey: 'vetName' },
    { id: 5, title: 'Clinic Adress', filter: true, dataKey: 'address' },
    { id: 6, title: 'Specialty', filter: true, dataKey: 'specialty' },
    { id: 7, title: 'Date and Time', filter: true, dataKey: 'date' },
    { id: 8, title: 'Status', filter: true, dataKey: 'status' },
    { id: 9, title: 'Action', filter: false },
  ];

  const clearAllFilters = () => {
    setFilters({});
    setDateFilter(getLocalToday());
  };

  const toggleFilter = (headerId: number) => {
    if (openFilterId === headerId) {
      setOpenFilterId(null);
    } else {
      setOpenFilterId(headerId);
    }
  };

  const hasActiveFilter = (dataKey?: keyof Data): boolean => {
    if (!dataKey) {
      return false;
    }

    if (dataKey === 'date') {
      return Boolean(dateFilter);
    }

    return Boolean(filters[dataKey]);
  };

  const getStatusClass = (status: string): string => {
    if (status === 'Scheduled') return styles.status_scheduled;
    if (status === 'Service provided') return styles.status_service_provided;
    if (status === 'Canceled') return styles.status_cancelled;
    return '';
  };

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.head_row}>
            {header.map((item) => (
              <th key={item.id}>
                <div className={styles.content_wrapper}>
                  {item.title}
                  {item.filter ? (
                    <span className="relative inline-flex items-center justify-center">
                      {hasActiveFilter(item.dataKey) ? (
                        <span className="pointer-events-none absolute left-[10px] top-[3px] h-[10px] w-[10px] rounded-full border-2 border-white bg-green-400 opacity-100"></span>
                      ) : null}
                      <img
                        src={filterIcon}
                        alt="filter"
                        onClick={() => toggleFilter(item.id)}
                      ></img>
                    </span>
                  ) : null}
                </div>

                {openFilterId === item.id && item.dataKey && (
                  <div ref={dropdownRef} className={styles.example}>
                    {(() => {
                      const dataKey = item.dataKey;
                      if (!dataKey) return null;

                      return [
                        ...new Set(
                          data.map((d) =>
                            dataKey === 'date'
                              ? String(d[dataKey]).slice(0, 10)
                              : String(d[dataKey])
                          )
                        ),
                      ].map((value, index) => {
                        const isActive =
                          dataKey === 'date'
                            ? dateFilter === value
                            : filters[dataKey] === value;

                        return (
                          <div
                            key={index}
                            className={`${styles.filter_option} ${isActive ? styles.filter_option_active : ''}`}
                            onClick={() => handleFilterSelect(dataKey, value)}
                          >
                            {value}
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 && (
            <tr>
              <td colSpan={9} className={styles.empty_state}>
                <div className={styles.empty_state_content}>
                  <img
                    src={noSearchIcon}
                    alt="No appointments"
                    className={styles.empty_state_icon}
                  />
                  {Object.keys(filters).length > 0 ? (
                    <>
                      <p className={styles.empty_state_title}>
                        No appointments found
                      </p>
                      <p className={styles.empty_state_subtitle}>
                        No appointments match the selected filters
                      </p>
                      <button
                        className={styles.clear_filters_btn}
                        onClick={clearAllFilters}
                      >
                        Clear all filters
                      </button>
                    </>
                  ) : (
                    <>
                      <p className={styles.empty_state_title}>
                        No appointments for today
                      </p>
                      <p className={styles.empty_state_subtitle}>
                        Try selecting a different date from the Date and Time
                        filter
                      </p>
                    </>
                  )}
                </div>
              </td>
            </tr>
          )}
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td>{item.clientName}</td>
              <td>{item.petName}</td>
              <td>{item.petAge}</td>
              <td>{item.vetName}</td>
              <td>{item.address}</td>
              <td>{item.specialty}</td>
              <td>{item.date}</td>
              <td>
                <span className={getStatusClass(item.status)}>
                  {item.status}
                </span>
              </td>
              <td>
                {item.status === 'Scheduled' && (
                  <div className={styles.icon_wrapper}>
                    <img
                      className="cursor-pointer"
                      src={Editor}
                      alt="edit"
                      onClick={() => {
                        onEditClick(item.id);
                        setComponentType('Reschedule');
                      }}
                    />
                    <img
                      className="cursor-pointer"
                      src={deleteIcon}
                      alt="delete"
                      onClick={() => {
                        onDeleteClick(item.id);
                        setComponentType('Cancel');
                      }}
                    />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
