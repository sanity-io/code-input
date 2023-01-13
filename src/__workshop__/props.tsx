import {Box, Container} from '@sanity/ui'
import {useWorkshopSanity} from '@sanity/ui-workshop-plugin-sanity'
import {isObjectSchemaType, useSchema} from 'sanity'
import {DocumentFormProvider, SelectedInput} from 'sanity-extra'

export default function PropsStory() {
  const {onPatchEvent} = useWorkshopSanity()
  const schema = useSchema()
  const schemaType = schema.get('test')

  if (!isObjectSchemaType(schemaType)) {
    return <>Not an object type</>
  }

  return (
    <DocumentFormProvider documentId="test" onPatchEvent={onPatchEvent} schemaType={schemaType}>
      <Container width={1}>
        <Box paddingX={4} paddingY={[5, 6, 7]}>
          <SelectedInput selectedPath={['code']} />
        </Box>
      </Container>
    </DocumentFormProvider>
  )
}
