import { useState, useEffect } from 'react'
import jsPDF from 'jspdf'

export default function App() {
  const [dataNascimento, setDataNascimento] = useState('')
  const [semanas, setSemanas] = useState('')
  const [resultado, setResultado] = useState(null)
  const [erro, setErro] = useState('')
  const [bebes, setBebes] = useState([])
 // const [nome, setNome] = useState('')

  // ✅ URL CORRIGIDA DO RENDER
  const API = 'https://prematuro-app.onrender.com'

  useEffect(() => {
    carregarBebes()
  }, [])

  async function carregarBebes() {
    try {
      const res = await fetch(`${API}/bebes`)
      const data = await res.json()
      setBebes(data)
    } catch (e) {
      console.error('Erro ao carregar bebês:', e)
    }
  }

  function calcular() {
    setErro('')

    if (!dataNascimento || Number(semanas) < 20 || Number(semanas) > 42) {
      setErro('Idade gestacional inválida')
      return
    }

    const nascimento = new Date(dataNascimento)
    const hoje = new Date()

    const diffDias = Math.floor((hoje - nascimento) / (1000 * 60 * 60 * 24))
    const prematuridade = (40 - Number(semanas)) * 7
    const idadeCorrigidaDias = diffDias - prematuridade

    const meses = Math.floor(idadeCorrigidaDias / 30)
    const dias = idadeCorrigidaDias % 30

    setResultado({ meses, dias })
  }

  async function salvar() {
    if (!nome) return

    try {
      await fetch(`${API}/bebes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, dataNascimento, semanas })
      })

      carregarBebes()
    } catch (e) {
      console.error('Erro ao salvar:', e)
    }
  }

  function gerarPDF() {
    if (!resultado) return

    const doc = new jsPDF()
    doc.text(`Resultado: ${resultado.meses} meses e ${resultado.dias} dias`, 10, 10)
    doc.save('relatorio.pdf')
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.title}>👶 Idade Corrigida</h2>

        <div style={styles.form}>

          <input
            type="date"
            value={dataNascimento}
            onChange={e => setDataNascimento(e.target.value)}
            style={styles.input}
          />

          <input
            type="number"
            placeholder="Semanas gestacionais"
            value={semanas}
            onChange={e => setSemanas(e.target.value)}
            style={styles.input}
          />

          <button onClick={calcular} style={styles.btnPrimary}>
            Calcular
          </button>

          <button onClick={salvar} style={styles.btnSecondary}>
            Salvar perfil
          </button>

        </div>

        {erro && <p style={styles.error}>{erro}</p>}

        {resultado && (
          <div style={styles.result}>
            <h3>{resultado.meses} meses</h3>
            <p>{resultado.dias} dias</p>
            <button onClick={gerarPDF} style={styles.btnPrimary}>
              Exportar PDF
            </button>
          </div>
        )}

        <div style={{ marginTop: 20 }}>
          <h4>Perfis</h4>
          {bebes.map((b, i) => (
            <div
              key={i}
              onClick={() => {
                setNome(b.nome)
                setDataNascimento(b.dataNascimento)
                setSemanas(b.semanas)
              }}
              style={styles.profile}
            >
              {b.nome}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0f172a, #1e293b)',
    color: '#fff'
  },
  card: {
    width: '100%',
    maxWidth: 420,
    padding: 24,
    borderRadius: 16,
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)'
  },
  title: {
    textAlign: 'center',
    marginBottom: 20
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  input: {
    padding: 12,
    borderRadius: 8,
    border: '1px solid #334155',
    background: '#0f172a',
    color: '#fff',
    width: '100%',
    fontSize: 16,
    minHeight: 44
  },
  btnPrimary: {
    padding: 12,
    borderRadius: 8,
    border: 'none',
    background: '#22c55e',
    color: '#fff',
    cursor: 'pointer'
  },
  btnSecondary: {
    padding: 12,
    borderRadius: 8,
    border: 'none',
    background: '#3b82f6',
    color: '#fff',
    cursor: 'pointer'
  },
  result: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    background: 'rgba(16,185,129,0.1)',
    textAlign: 'center'
  },
  error: {
    color: '#f87171',
    marginTop: 10
  },
  profile: {
    padding: 10,
    marginTop: 8,
    borderRadius: 8,
    background: 'rgba(255,255,255,0.05)',
    cursor: 'pointer'
  }
}
