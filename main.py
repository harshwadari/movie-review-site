import pandas as pd
import matplotlib.pyplot as plt

# Function to search for the movie and display pie chart
def show_movie_pie_chart(movie_title, df):
    # Search for the movie in the dataframe
    movie = df[df['title'].str.lower() == movie_title.lower()]
    
    if movie.empty:
        print(f"Movie '{movie_title}' not found in the dataset.")
        return
    
    # Extract the vote average
    vote_average = movie['vote_average'].values[0]
    
    # Ensure vote_average is numeric
    try:
        vote_average = float(vote_average)  # Convert to float
    except ValueError:
        print(f"Invalid vote average for '{movie_title}'.")
        return
    
    # Calculate percentages
    positive_percentage = vote_average * 10  # Vote average out of 10, so multiply by 10 to get percentage
    neutral_percentage = 20  # Always 20% neutral
    negative_percentage = 100 - positive_percentage - neutral_percentage  # Remaining is negative
    
    # Ensure percentages are valid
    if positive_percentage < 0 or positive_percentage > 100:
        print(f"Invalid vote average percentage for '{movie_title}'.")
        return
    
    # Pie chart data
    labels = ['Positive', 'Neutral', 'Negative']
    sizes = [positive_percentage, neutral_percentage, negative_percentage]
    colors = ['#4CAF50', '#FFC107', '#F44336']  # Green, Yellow, Red

    # Plotting the pie chart
    plt.figure(figsize=(7, 7))
    plt.pie(sizes, labels=labels, colors=colors, autopct='%1.1f%%', startangle=90, wedgeprops={'edgecolor': 'black'})
    plt.title(f"Sentiment Analysis for '{movie_title}'")
    plt.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle.
    plt.show()

# Load the CSV file into a pandas DataFrame
def load_data(file_path):
    # Load the CSV data and ensure 'vote_average' is numeric
    df = pd.read_csv(file_path)
    df['vote_average'] = pd.to_numeric(df['vote_average'], errors='coerce')  # Convert vote_average to numeric
    return df

# Main execution
if __name__ == "__main__":
    # Load the data
    file_path = 'tmdb3.csv'  # Make sure the CSV file is in the same directory or provide the full path
    df = load_data(file_path)
    
    # Ask the user to input a movie title
    movie_title = input("Enter the movie title: ")
    
    # Show the pie chart for the entered movie title
    show_movie_pie_chart(movie_title, df)