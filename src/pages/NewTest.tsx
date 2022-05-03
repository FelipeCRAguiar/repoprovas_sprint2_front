import React from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
import useAuth from "../hooks/useAuth";
import { useTheme } from "@emotion/react";
import Autocomplete from '@mui/material/Autocomplete';
import api from "../services/api";
import { useNavigate } from "react-router-dom";


export function NewTest() {
  const navigate = useNavigate();

  const { token } : any = useAuth()

  const [optionList, setOptionList] = useState<any>({
    discipline: [],
    teacher: [],
    category: [],
  })

  const [createTestForm, setCreateTestForm] = useState({
    title: "",
    pdf: "",
    category: "",
    discipline: "",
    teacher: ""
  });

  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = {
      name: createTestForm.title,
      pdfUrl: createTestForm.pdf,
      categoryId: optionList.category.find((category: any) => category.name === createTestForm.category).id,
      teacherDisciplineId: optionList.teacher.find((teacher: any) =>
        teacher.name === createTestForm.teacher).teacherDisciplines.find((teacherDiscipline: any) =>
          teacherDiscipline.disciplineId === optionList.discipline.find((discipline: any) =>
            discipline.name === createTestForm.discipline).id).id

    }

    try {
      setLoading(true)

      await api.createTest(token, data)
      alert("Teste criado com sucesso")
      setCreateTestForm({
        title: "",
        pdf: "",
        category: "",
        discipline: "",
        teacher: ""
      });



    } catch (error) {
      alert("algo deu errado")

    }
  }

  async function getData() {
    const disciplines = await api.getDisciplines(token)
    const teachers = await api.getTeachers(token)
    const categories = await api.getCategories(token)

    setOptionList({
      discipline: disciplines.data,
      teacher: teachers.data,
      category: categories.data.categories,
    })

  }

  useEffect(() => {
    getData()
  }, []);

  useEffect(() => {

    setCreateTestForm({
      ...createTestForm,
      teacher: ""
    })

  }, [createTestForm.discipline]);


  function handleFormInput(name: string, value: any) {

    setCreateTestForm({ ...createTestForm, [name]: value })

  }

  function handleFreeFormInput(event: any) {
    setCreateTestForm({ ...createTestForm, [event.target.name]: event.target.value })
  }

  function disableForm(formData: string): boolean {
    return formData === ""
  }

  return (
    <>
      <Box
        sx={{
          marginX: "auto",
          width: "700px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            onClick={() => navigate("/app/disciplinas")}
          >
            Disciplinas
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/app/pessoas-instrutoras")}
          >
            Pessoa Instrutora
          </Button>
          <Button variant="outlined" onClick={() => navigate("/app/adicionar")}>
            Adicionar
          </Button>
        </Box>
        <Box
          sx={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box

            component="form"
            onSubmit={handleSubmit}
            sx={{
              marginTop: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              width: "80vw"
            }}
          >
            <TextField
              fullWidth={true}
              variant="filled"
              type="string"
              required
              id="title"
              label="Título da prova"
              name="title"
              InputLabelProps={{
                color: "secondary"
              }}
              value={createTestForm.title}
              onChange={handleFreeFormInput}
            />
            <TextField
              fullWidth={true}
              variant="filled"
              required
              type="url"
              id="pdf"
              label="PDF da Prova"
              name="pdf"
              InputLabelProps={{
                color: "secondary"
              }}
              value={createTestForm.pdf}
              onChange={handleFreeFormInput}
            />
            <Autocomplete
              fullWidth={true}
              id="category-input"
              options={optionList.category.map((option: any) => option.name)}
              autoComplete={true}
              onInputChange={(e, value) => handleFormInput("category", value)}
              renderInput={(params) =>
                <TextField
                  {...params}
                  label="Categoria"
                  variant="filled"
                  InputLabelProps={{
                    color: "secondary"
                  }}
                  required
                  size="small"
                />}
            />
            <Autocomplete
              fullWidth={true}
              id="discipline-input"
              options={optionList.discipline.map((option: any) => option.name)}
              autoComplete={true}
              onInputChange={(e, value) => handleFormInput("discipline", value)}
              renderInput={(params) =>
                <TextField
                  {...params}
                  label="Disciplina"
                  variant="filled"
                  InputLabelProps={{
                    color: "secondary"
                  }}
                  required
                  size="small"
                />}
            />
            <Autocomplete
              fullWidth={true}
              id="teacher-input"
              options={createTestForm.discipline
                ? optionList.teacher.filter((el: any) =>
                  el.teacherDisciplines.map((el: any) =>
                    el.disciplineId).includes(optionList.discipline.find((el: any) =>
                      el.name === createTestForm.discipline).id)).map((el: any) =>
                        el.name)
                : ["Escolha uma disciplina primeiro"]
              }
              autoComplete={true}
              disabled={disableForm(createTestForm.discipline)}
              onInputChange={(e, value) => handleFormInput("teacher", value)}
              renderInput={(params) =>
                <TextField
                  {...params}
                  label="Pessoa Instrutora"
                  variant="filled"
                  InputLabelProps={{
                    color: "secondary"
                  }}
                  required
                  size="small"
                />}
            />
            <Button sx={{ mb: 5 }}
              color="secondary"
              type="submit"
              fullWidth
              variant="contained"
            >
              <Typography
                component="h1"
                variant="button"
              >
                {loading
                  ? "Carregando"
                  : "Adicionar"
                }
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>
    </>


  )
}