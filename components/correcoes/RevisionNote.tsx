type RevisionNoteProps = {
    note: {
      localizacao: { sessao: string; proximoDe: string }
      comentario: string
      sugestao: string
    }
  }
  
  export default function RevisionNote({ note }: RevisionNoteProps) {
      return (
          <div className="border p-4 rounded-lg space-y-2">
              <span className="font-semibold">{note.localizacao.sessao} - {note.localizacao.proximoDe}</span>
              <p className="text-sm">{note.comentario}</p>
              <p className="text-sm text-muted-foreground"><strong>Sugestão:</strong> {note.sugestao}</p>
          </div>
      )
  }
  