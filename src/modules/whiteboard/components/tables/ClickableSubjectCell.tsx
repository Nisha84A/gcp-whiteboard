import { useAppDispatch, useAppSelector } from '@/shared/store';
import { setFilter } from '@/shared/store/filterSlice';

interface Props {
  subjectId: string;
}

export default function ClickableSubjectCell({ subjectId }: Props) {
  const dispatch = useAppDispatch();
  const subjectIds = useAppSelector((state) => state.filter.filters.subjectIds);
  const isActive = subjectIds.includes(subjectId);

  const handleClick = () => {
    if (isActive) {
      dispatch(setFilter({ key: 'subjectIds', value: subjectIds.filter((id) => id !== subjectId) }));
    } else {
      dispatch(setFilter({ key: 'subjectIds', value: [...subjectIds, subjectId] }));
    }
  };

  return (
    <span
      onClick={handleClick}
      className={`font-mono font-semibold cursor-pointer hover:underline ${
        isActive ? 'text-cyan-300 bg-cyan-900/30 px-1 rounded' : 'text-cyan-400'
      }`}
      title={isActive ? `Remove ${subjectId} filter` : `Filter to ${subjectId}`}
    >
      {subjectId}
    </span>
  );
}
