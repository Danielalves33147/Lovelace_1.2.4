import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputForm from './InputForm';
import TextArea from './TextArea';
import QuestionBox from '../questions/QuestionBox';
import SubmitButton from './SubmitButton';
import styles from './FormActivity.module.css';

function generateAccessCode(length = 8) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function FormActivity({ handleSubmit }) {
  const [activities, setActivities] = useState({
    name: '',
    description: '',
    accessCode: generateAccessCode(), // Generate access code when activity is created
    questions: [],
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setActivities({
      ...activities,
      [e.target.name]: e.target.value,
    });
  };

  const addQuestion = () => {
    setActivities({
      ...activities,
      questions: [...activities.questions, { id: Date.now(), proposal: '', text: '' }],
    });
  };

  const handleQuestionChange = (id, field, value) => {
    const updatedQuestions = activities.questions.map((question) => {
      if (question.id === id) {
        return { ...question, [field]: value };
      }
      return question;
    });
    setActivities({ ...activities, questions: updatedQuestions });
  };

  const removeQuestion = (id) => {
    const questionsUpdated = activities.questions.filter((question) => question.id !== id);
    setActivities({ ...activities, questions: questionsUpdated });
  };
/**/
  const submit = async (e) => {
    e.preventDefault();
    try {
      const createdActivity = await handleSubmit(activities);
      if(createdActivity){
        navigate(`/activity/${createdActivity.id}`);
      }else{
        console.log("ERROOOOOOOOOOOOOOOOOO");
      }
    } catch (error) {
      console.error('Erro ao criar a atividade:', error);
      // Tratar o erro aqui, se necessário
    }
  };

  return (
    <form onSubmit={submit} className={styles.form_container} id='alpha'>
    <div className={styles.navbar}>
      <h1 id="love">Sala Personalizada</h1>
      <SubmitButton text="Criar Sala" />
    </div>
    <div className={styles.header_container}>
      <InputForm
        className={styles.header_container_input}
        type="text"
        name="name"
        placeholder="Nome da Sala"
        value={activities.name}
        handleOnChange={handleChange}
      />
      <TextArea
        name="description"
        placeholder="Descrição"
        value={activities.description}
        handleOnChange={handleChange}
      />
    </div>
    <button className={styles.btn} type="button" onClick={addQuestion}>Adicionar Questão</button>
    <div className={styles.questions_container}>
      {activities.questions.length > 0 &&
        activities.questions.map((question) => (
          <QuestionBox
            key={question.id}
            id={question.id}
            proposal={question.proposal}
            text={question.text}
            handleQuestionChange={handleQuestionChange}
            handleRemove={removeQuestion}
          />
        ))}
    </div>
  </form>
  );
}

export default FormActivity;
