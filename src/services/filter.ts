export function filterDiscipline(repository: any, disciplineName: string) {
  return repository.map((el: any) => { return { ...el, disciplines: el["disciplines"].filter((el: any) => el.discipline.name.includes(disciplineName)) } }).filter((el: any) => el.disciplines.length !== 0)
}

export function filterTeacher(repository: any, teacherName: string) {
  return repository.filter((el: any) => el.teacher.name.includes(teacherName))
}