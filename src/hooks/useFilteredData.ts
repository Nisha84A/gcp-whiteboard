import { useMemo } from 'react';
import { useAppSelector } from '@/store';
import { PageFilters } from '@/store/filterSlice';
import { Subject, LabTest, AdverseEvent, Exposure, MedicalHistory, ConcomitantMed, Visit } from '@/types';

function matchesSubject(subjId: string, filters: PageFilters, subjectMap: Map<string, Subject>): boolean {
  const subj = subjectMap.get(subjId);
  if (!subj) return true;

  if (filters.subjectIds.length && !filters.subjectIds.includes(subjId)) return false;
  if (filters.arms.length && !filters.arms.includes(subj.arm)) return false;
  if (filters.sites.length && !filters.sites.includes(subj.site)) return false;
  if (filters.sex.length && !filters.sex.includes(subj.sex)) return false;
  if (filters.vitalStatus.length && !filters.vitalStatus.includes(subj.vital)) return false;
  if (filters.studyStatus.length && !filters.studyStatus.includes(subj.status)) return false;

  return true;
}

function matchesStudyDay(day: number | undefined, filters: PageFilters): boolean {
  if (day === undefined) return true;
  const [min, max] = filters.studyDayRange;
  if (min !== null && day < min) return false;
  if (max !== null && day > max) return false;
  return true;
}

export function useFilteredData() {
  const { subjects, labs, ae, ex, mh, cm, visits } = useAppSelector((state) => state.data);
  const filters = useAppSelector((state) => state.filter.filters);

  const subjectMap = useMemo(
    () => new Map(subjects.map((s) => [s.id, s])),
    [subjects]
  );

  const hasActiveFilters = useMemo(() => {
    return (
      filters.subjectIds.length > 0 ||
      filters.arms.length > 0 ||
      filters.sites.length > 0 ||
      filters.sex.length > 0 ||
      filters.vitalStatus.length > 0 ||
      filters.studyStatus.length > 0 ||
      filters.aeSeverity.length > 0 ||
      filters.aeRelatedness.length > 0 ||
      filters.studyDayRange[0] !== null ||
      filters.studyDayRange[1] !== null
    );
  }, [filters]);

  const filteredSubjects = useMemo<Subject[]>(() => {
    if (!hasActiveFilters) return subjects;
    return subjects.filter((s) => {
      if (filters.subjectIds.length && !filters.subjectIds.includes(s.id)) return false;
      if (filters.arms.length && !filters.arms.includes(s.arm)) return false;
      if (filters.sites.length && !filters.sites.includes(s.site)) return false;
      if (filters.sex.length && !filters.sex.includes(s.sex)) return false;
      if (filters.vitalStatus.length && !filters.vitalStatus.includes(s.vital)) return false;
      if (filters.studyStatus.length && !filters.studyStatus.includes(s.status)) return false;
      return true;
    });
  }, [subjects, filters, hasActiveFilters]);

  const filteredLabs = useMemo<LabTest[]>(() => {
    if (!hasActiveFilters) return labs;
    return labs.filter((l) => {
      if (!matchesSubject(l.subjid, filters, subjectMap)) return false;
      if (!matchesStudyDay(l.lbdy, filters)) return false;
      return true;
    });
  }, [labs, filters, subjectMap, hasActiveFilters]);

  const filteredAE = useMemo<AdverseEvent[]>(() => {
    if (!hasActiveFilters) return ae;
    return ae.filter((a) => {
      if (!matchesSubject(a.subjid, filters, subjectMap)) return false;
      if (filters.aeSeverity.length && !filters.aeSeverity.includes(a.aesev)) return false;
      if (filters.aeRelatedness.length && !filters.aeRelatedness.includes(a.aerel)) return false;
      if (!matchesStudyDay(a.aestdy, filters)) return false;
      return true;
    });
  }, [ae, filters, subjectMap, hasActiveFilters]);

  const filteredEx = useMemo<Exposure[]>(() => {
    if (!hasActiveFilters) return ex;
    return ex.filter((e) => {
      if (!matchesSubject(e.subjid, filters, subjectMap)) return false;
      if (!matchesStudyDay(e.exstdy, filters)) return false;
      return true;
    });
  }, [ex, filters, subjectMap, hasActiveFilters]);

  const filteredMH = useMemo<MedicalHistory[]>(() => {
    if (!hasActiveFilters) return mh;
    return mh.filter((m) => matchesSubject(m.subjid, filters, subjectMap));
  }, [mh, filters, subjectMap, hasActiveFilters]);

  const filteredCM = useMemo<ConcomitantMed[]>(() => {
    if (!hasActiveFilters) return cm;
    return cm.filter((c) => {
      if (!matchesSubject(c.subjid, filters, subjectMap)) return false;
      if (!matchesStudyDay(c.cmstdy, filters)) return false;
      return true;
    });
  }, [cm, filters, subjectMap, hasActiveFilters]);

  const filteredVisits = useMemo<Visit[]>(() => {
    if (!hasActiveFilters) return visits;
    return visits.filter((v) => matchesSubject(v.subjid, filters, subjectMap));
  }, [visits, filters, subjectMap, hasActiveFilters]);

  return {
    subjects: filteredSubjects,
    labs: filteredLabs,
    ae: filteredAE,
    ex: filteredEx,
    mh: filteredMH,
    cm: filteredCM,
    visits: filteredVisits,
    hasActiveFilters,
  };
}

export function useFilterOptions() {
  const { subjects, ae } = useAppSelector((state) => state.data);

  return useMemo(() => ({
    subjectIds: subjects.map((s) => s.id),
    arms: Array.from(new Set(subjects.map((s) => s.arm))),
    sites: Array.from(new Set(subjects.map((s) => s.site))),
    sex: Array.from(new Set(subjects.map((s) => s.sex))),
    vitalStatus: Array.from(new Set(subjects.map((s) => s.vital))),
    studyStatus: Array.from(new Set(subjects.map((s) => s.status))),
    aeSeverity: Array.from(new Set(ae.map((a) => a.aesev))),
    aeRelatedness: Array.from(new Set(ae.map((a) => a.aerel))),
  }), [subjects, ae]);
}
