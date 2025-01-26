import { CalendarGrid } from './components/CalendarGrid';
import { Provider } from 'jotai';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <Provider>
        <CalendarGrid />
      </Provider>
      </header>
    </div>
  );
}

export default App;
