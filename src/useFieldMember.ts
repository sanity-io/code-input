import {useMemo} from 'react'
import type {FieldMember, ObjectMember} from 'sanity'

/** @internal */
export function useFieldMember(
  members: ObjectMember[],
  fieldName: string,
): FieldMember | undefined {
  return useMemo(
    () =>
      members.find(
        (member): member is FieldMember => member.kind === 'field' && member.name === fieldName,
      ),
    [members, fieldName],
  )
}
