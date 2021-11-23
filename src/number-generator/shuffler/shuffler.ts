export class Shuffler<T> {

    shuffle(items: T[]): T[] {
        let currentIndex = items.length;
        const shuffledItems = [...items];

        while (currentIndex !== 0) {
            const randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [shuffledItems[currentIndex], shuffledItems[randomIndex]] =
                [shuffledItems[randomIndex], shuffledItems[currentIndex]];
        }

        return shuffledItems;
    }
}