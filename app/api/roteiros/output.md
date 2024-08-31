# Roteiro de Estudo: Programação Orientada a Objetos (POO) em Java

## Introdução à POO
A Programação Orientada a Objetos é um paradigma de programação que utiliza "objetos" para modelar dados e comportamentos. Em Java, a POO permite a construção de programas mais modularizados e reutilizáveis.

## Principais Conceitos de POO

### 1. Classes e Objetos
- **Classe**: Um modelo ou um blueprint a partir do qual objetos são criados.
- **Objeto**: Uma instância de uma classe.

**Exemplo:**
```java
class Carro {
    String modelo;
    String cor;
    
    void acelerar() {
        System.out.println("O carro está acelerando.");
    }
}

Carro meuCarro = new Carro();
meuCarro.modelo = "Fusca";
meuCarro.cor = "azul";
meuCarro.acelerar();
```

### 2. Encapsulamento
- O encapsulamento envolve ocultar os detalhes internos de uma classe e proteger os dados. Isso é realizado através do uso de modificadores de acesso.

**Exemplo:**
```java
class ContaBancaria {
    private double saldo;

    public void depositar(double valor) {
        saldo += valor;
    }

    public double getSaldo() {
        return saldo;
    }
}
```

### 3. Herança
- A herança permite que uma classe herde características (atributos e métodos) de outra classe. Isso promove a reutilização de código.

**Exemplo:**
```java
class Veiculo {
    void mover() {
        System.out.println("O veículo está se movendo.");
    }
}

class Moto extends Veiculo {
    void acelerar() {
        System.out.println("A moto está acelerando.");
    }
}
```

### 4. Polimorfismo
- O polimorfismo permite que uma classe ou método tenha várias formas. Isso pode ser alcançado através de sobrecarga de métodos ou sobreposição de métodos.

**Exemplo:**
```java
class Animal {
    void fazerSom() {
        System.out.println("O animal faz som.");
    }
}

class Cachorro extends Animal {
    void fazerSom() {
        System.out.println("O cachorro late.");
    }
}

void escutarSom(Animal animal) {
    animal.fazerSom();
}

// Uso
Animal meuCachorro = new Cachorro();
escutarSom(meuCachorro); // Saída: O cachorro late.
```

### 5. Abstração
- A abstração é o processo de ocultar a complexidade e mostrar apenas os recursos essenciais do objeto.

**Exemplo:**
```java
abstract class Forma {
    abstract void desenhar();
}

class Circulo extends Forma {
    void desenhar() {
        System.out.println("Desenhando um círculo.");
    }
}
```

## Conclusão
Compreender os conceitos de POO é fundamental para desenvolver aplicações mais complexas e eficientes em Java. À medida que você avança, é essencial praticar a implementação desses conceitos em projetos reais.

## Fontes de Estudo
- **Documentação Oficial do Java:** [Java Documentation](https://docs.oracle.com/en/java/)
- **Curso de POO em Java - Alura:** [Alura](https://www.alura.com.br/cursos-online-java)
- **Livro: "Head First Java" de Kathy Sierra e Bert Bates**
- **Tutorial de POO em Java no W3Schools:** [W3Schools Java POO](https://www.w3schools.com/java/java_oop.asp)

Sinta-se à vontade para explorar essas fontes e pratique a codificação dos exemplos apresentados para consolidar seus conhecimentos. Boa sorte nos seus estudos!