/** @typedef {'clauses_json'|'annotations_csv'|'compliance_report'|'updated_contract_txt'|'updated_contract_pdf'} ArtifactType */

export const ARTIFACT_LABELS = {
  clauses_json: 'Clauses JSON',
  annotations_csv: 'Annotations CSV',
  compliance_report: 'Compliance Report',
  updated_contract_txt: 'Updated Contract TXT',
  updated_contract_pdf: 'Updated Contract PDF',
}

export const ARTIFACT_ORDER = Object.keys(ARTIFACT_LABELS)
